import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { streamChatResponse } from '@/lib/ai/client'
import { buildSystemPrompt, checkAfterHours } from '@/lib/ai/prompts'
import { extractPatientInfo, mergePatientInfo } from '@/lib/ai/extract-info'
import type { PracticeContext } from '@/lib/ai/prompts'
import type { ChatMessage } from '@/lib/ai/client'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const RATE_LIMIT_MAX = 30
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour

/**
 * POST /api/chat
 *
 * Public endpoint for the chatbot widget. No auth required.
 * Validates embed key, loads server-side conversation history,
 * streams Claude response back to the client.
 *
 * Body: { embedKey: string, sessionId: string, message: string }
 * Returns: Server-Sent Events stream of AI response tokens
 */
export async function POST(request: NextRequest) {
  let body: { embedKey?: string; sessionId?: string; message?: string }
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    })
  }

  const { embedKey, sessionId, message } = body

  if (!embedKey || !sessionId || !message) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields: embedKey, sessionId, message' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    )
  }

  if (message.length > 2000) {
    return new Response(
      JSON.stringify({ error: 'Message too long (max 2000 characters)' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    )
  }

  // Use admin client to bypass RLS — this is a public endpoint
  const supabase = createAdminClient()

  // 1. Validate embed key and load chatbot config
  const { data: config, error: configError } = await supabase
    .from('chatbot_configs')
    .select('*, practices(id, name, phone, address_line1, city, state, timezone)')
    .eq('embed_key', embedKey)
    .eq('is_active', true)
    .single()

  if (configError || !config) {
    return new Response(
      JSON.stringify({ error: 'Invalid or inactive embed key' }),
      { status: 404, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    )
  }

  const practice = config.practices as unknown as {
    id: string
    name: string
    phone: string | null
    address_line1: string | null
    city: string | null
    state: string | null
    timezone: string | null
  }

  // 2. Rate limiting: max 30 messages per session per hour
  const oneHourAgo = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString()
  const { count: recentMsgCount } = await supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('conversation_id', (
      // Get conversation IDs for this session
      await supabase
        .from('conversations')
        .select('id')
        .eq('embed_key', embedKey)
        .eq('session_id', sessionId)
    ).data?.[0]?.id ?? '00000000-0000-0000-0000-000000000000')
    .eq('role', 'user')
    .gte('created_at', oneHourAgo)

  if ((recentMsgCount ?? 0) >= RATE_LIMIT_MAX) {
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
      { status: 429, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    )
  }

  // 3. Check if Open Dental is connected
  const { data: odConfig } = await supabase
    .from('open_dental_configs')
    .select('is_active')
    .eq('practice_id', practice.id)
    .eq('is_active', true)
    .single()

  // 4. Determine after-hours status
  const isAfterHours = checkAfterHours(config.office_hours, practice.timezone ?? undefined)
  const tz = practice.timezone || 'America/New_York'
  const currentTime = new Date().toLocaleString('en-US', { timeZone: tz })

  // 5. Find or create conversation
  let { data: conversation } = await supabase
    .from('conversations')
    .select('id')
    .eq('embed_key', embedKey)
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!conversation) {
    const { data: newConversation, error: convError } = await supabase
      .from('conversations')
      .insert({
        practice_id: practice.id,
        embed_key: embedKey,
        session_id: sessionId,
        status: 'active',
        is_after_hours: isAfterHours,
      })
      .select('id')
      .single()

    if (convError || !newConversation) {
      return new Response(
        JSON.stringify({ error: 'Failed to create conversation' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      )
    }
    conversation = newConversation
  }

  // 6. Store the user's message
  await supabase.from('messages').insert({
    practice_id: practice.id,
    conversation_id: conversation.id,
    role: 'user',
    content: message,
  })

  // 7. Load conversation history from database (server-side, prevents prompt injection)
  const { data: dbMessages } = await supabase
    .from('messages')
    .select('role, content')
    .eq('conversation_id', conversation.id)
    .order('created_at', { ascending: true })
    .limit(50)

  const conversationHistory: ChatMessage[] = (dbMessages ?? [])
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))

  // 8. Build system prompt with practice context
  const address = [practice.address_line1, practice.city, practice.state]
    .filter(Boolean)
    .join(', ')

  const practiceContext: PracticeContext = {
    practiceName: practice.name,
    botName: config.bot_name,
    officeHours: config.office_hours,
    acceptedInsurance: config.accepted_insurance,
    services: config.services,
    providersDisplay: config.providers_display,
    customFaqs: config.custom_faqs,
    systemPromptAdditions: config.system_prompt_additions,
    hasOpenDental: !!odConfig?.is_active,
    address: address || null,
    phone: practice.phone,
    currentTime,
    isAfterHours,
  }

  const systemPrompt = buildSystemPrompt(practiceContext)

  // 9. Stream Claude response using Server-Sent Events
  const encoder = new TextEncoder()
  const conversationId = conversation.id
  const practiceId = practice.id

  const stream = new ReadableStream({
    async start(controller) {
      try {
        await streamChatResponse({
          systemPrompt,
          messages: conversationHistory,
          onToken: (token) => {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'token', content: token })}\n\n`)
            )
          },
          onDone: async (response) => {
            // Store assistant response in database
            await supabase.from('messages').insert({
              practice_id: practiceId,
              conversation_id: conversationId,
              role: 'assistant',
              content: response,
            })

            // Extract patient info from the full conversation
            const allMessages = [
              ...conversationHistory,
              { role: 'assistant' as const, content: response },
            ]
            const extracted = extractPatientInfo(allMessages)

            // Load existing conversation data for merging
            const { data: existingConv } = await supabase
              .from('conversations')
              .select('patient_name, patient_phone, patient_email, patient_dob, insurance_carrier, reason_for_visit, is_new_patient')
              .eq('id', conversationId)
              .single()

            const merged = mergePatientInfo(existingConv ?? {}, extracted)

            // Update conversation with extracted info
            const hasPatientContact = !!(merged.patient_name || merged.patient_phone || merged.patient_email)
            const updates: Record<string, unknown> = {}

            if (merged.patient_name) updates.patient_name = merged.patient_name
            if (merged.patient_phone) updates.patient_phone = merged.patient_phone
            if (merged.patient_email) updates.patient_email = merged.patient_email
            if (merged.patient_dob) updates.patient_dob = merged.patient_dob
            if (merged.insurance_carrier) updates.insurance_carrier = merged.insurance_carrier
            if (merged.reason_for_visit) updates.reason_for_visit = merged.reason_for_visit
            if (merged.is_new_patient !== null && merged.is_new_patient !== undefined) {
              updates.is_new_patient = merged.is_new_patient
            }

            // Auto-promote to lead status when contact info is collected
            if (hasPatientContact && existingConv) {
              const { data: currentConv } = await supabase
                .from('conversations')
                .select('status')
                .eq('id', conversationId)
                .single()
              if (currentConv?.status === 'active') {
                updates.status = 'lead'
              }
            }

            if (Object.keys(updates).length > 0) {
              await supabase
                .from('conversations')
                .update(updates)
                .eq('id', conversationId)
            }

            // Send done event with metadata
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: 'done',
                  conversationId,
                  metadata: {
                    isAfterHours,
                    extractedInfo: merged,
                  },
                })}\n\n`
              )
            )
            controller.close()
          },
          onError: (error) => {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: 'error',
                  message: "I apologize, but I'm having trouble right now. Please try again or call the office directly.",
                })}\n\n`
              )
            )
            controller.close()
            console.error('Chat stream error:', error.message)
          },
        })
      } catch {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: 'error', message: 'Connection error. Please try again.' })}\n\n`
          )
        )
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      ...CORS_HEADERS,
    },
  })
}

/** Handle CORS preflight for widget cross-origin requests */
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  })
}
