import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { streamChatResponse } from '@/lib/ai/client'
import { buildSystemPrompt } from '@/lib/ai/prompts'
import type { PracticeContext } from '@/lib/ai/prompts'
import type { ChatMessage } from '@/lib/ai/client'

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
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { embedKey, sessionId, message } = body

  if (!embedKey || !sessionId || !message) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields: embedKey, sessionId, message' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  if (message.length > 2000) {
    return new Response(
      JSON.stringify({ error: 'Message too long (max 2000 characters)' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // Use admin client to bypass RLS — this is a public endpoint
  const supabase = createAdminClient()

  // 1. Validate embed key and load chatbot config
  const { data: config, error: configError } = await supabase
    .from('chatbot_configs')
    .select('*, practices(id, name, phone, address_line1, city, state)')
    .eq('embed_key', embedKey)
    .eq('is_active', true)
    .single()

  if (configError || !config) {
    return new Response(
      JSON.stringify({ error: 'Invalid or inactive embed key' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const practice = config.practices as unknown as {
    id: string
    name: string
    phone: string | null
    address_line1: string | null
    city: string | null
    state: string | null
  }

  // 2. Check if Open Dental is connected
  const { data: odConfig } = await supabase
    .from('open_dental_configs')
    .select('is_active')
    .eq('practice_id', practice.id)
    .eq('is_active', true)
    .single()

  // 3. Find or create conversation
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
      })
      .select('id')
      .single()

    if (convError || !newConversation) {
      return new Response(
        JSON.stringify({ error: 'Failed to create conversation' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
    conversation = newConversation
  }

  // 4. Store the user's message
  await supabase.from('messages').insert({
    practice_id: practice.id,
    conversation_id: conversation.id,
    role: 'user',
    content: message,
  })

  // 5. Load conversation history from database (server-side, prevents prompt injection)
  const { data: dbMessages } = await supabase
    .from('messages')
    .select('role, content')
    .eq('conversation_id', conversation.id)
    .order('created_at', { ascending: true })
    .limit(50) // Cap history to prevent excessive token usage

  const conversationHistory: ChatMessage[] = (dbMessages ?? [])
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))

  // 6. Build system prompt with practice context
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
  }

  const systemPrompt = buildSystemPrompt(practiceContext)

  // 7. Stream Claude response using Server-Sent Events
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const fullResponse = await streamChatResponse({
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
              practice_id: practice.id,
              conversation_id: conversation!.id,
              role: 'assistant',
              content: response,
            })

            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: 'done', conversationId: conversation!.id })}\n\n`
              )
            )
            controller.close()
          },
          onError: (error) => {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: 'error', message: 'I apologize, but I\'m having trouble right now. Please try again or call the office directly.' })}\n\n`
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
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

/** Handle CORS preflight for widget cross-origin requests */
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
