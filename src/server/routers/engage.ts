import { z } from 'zod'
import { router, protectedProcedure, adminProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'

export const engageRouter = router({
  /** Get chatbot config for the current practice */
  getChatbotConfig: protectedProcedure.query(async ({ ctx }) => {
    const practiceId = ctx.dbUser.practice_id
    if (!practiceId) throw new TRPCError({ code: 'BAD_REQUEST', message: 'No practice associated' })

    const { data, error } = await ctx.supabase
      .from('chatbot_configs')
      .select('*')
      .eq('practice_id', practiceId)
      .single()

    if (error && error.code !== 'PGRST116') throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

    return data
  }),

  /** Update chatbot config (admin only) */
  updateChatbotConfig: adminProcedure
    .input(
      z.object({
        bot_name: z.string().min(1).max(50).optional(),
        welcome_message: z.string().min(1).max(500).optional(),
        primary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
        logo_url: z.string().url().nullable().optional(),
        is_active: z.boolean().optional(),
        office_hours: z.record(z.string(), z.object({
          open: z.string(),
          close: z.string(),
        })).optional(),
        accepted_insurance: z.array(z.string()).optional(),
        services: z.array(z.string()).optional(),
        providers_display: z.array(z.object({
          name: z.string(),
          specialty: z.string().optional(),
        })).optional(),
        custom_faqs: z.array(z.object({
          question: z.string(),
          answer: z.string(),
        })).optional(),
        system_prompt_additions: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const practiceId = ctx.dbUser.practice_id
      if (!practiceId) throw new TRPCError({ code: 'BAD_REQUEST', message: 'No practice associated' })

      // Upsert: create if doesn't exist, update if it does
      const { data, error } = await ctx.supabase
        .from('chatbot_configs')
        .upsert(
          { practice_id: practiceId, ...input },
          { onConflict: 'practice_id' }
        )
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  /** List conversations with filters */
  getConversations: protectedProcedure
    .input(
      z.object({
        status: z.enum(['active', 'lead', 'booked', 'closed', 'spam']).optional(),
        search: z.string().optional(),
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
        limit: z.number().min(1).max(100).default(25),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const practiceId = ctx.dbUser.practice_id
      if (!practiceId) throw new TRPCError({ code: 'BAD_REQUEST', message: 'No practice associated' })

      let query = ctx.supabase
        .from('conversations')
        .select('*, messages(id, role, content, created_at)', { count: 'exact' })
        .eq('practice_id', practiceId)
        .order('created_at', { ascending: false })
        .range(input.offset, input.offset + input.limit - 1)

      if (input.status) {
        query = query.eq('status', input.status)
      }

      if (input.search) {
        query = query.or(
          `patient_name.ilike.%${input.search}%,patient_email.ilike.%${input.search}%,patient_phone.ilike.%${input.search}%`
        )
      }

      if (input.dateFrom) {
        query = query.gte('created_at', input.dateFrom)
      }

      if (input.dateTo) {
        query = query.lte('created_at', input.dateTo)
      }

      const { data, count, error } = await query

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

      return { conversations: data ?? [], total: count ?? 0 }
    }),

  /** Get a single conversation with all messages */
  getConversation: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const practiceId = ctx.dbUser.practice_id
      if (!practiceId) throw new TRPCError({ code: 'BAD_REQUEST', message: 'No practice associated' })

      const { data, error } = await ctx.supabase
        .from('conversations')
        .select('*, messages(id, role, content, metadata, created_at)')
        .eq('id', input.id)
        .eq('practice_id', practiceId)
        .single()

      if (error) throw new TRPCError({ code: 'NOT_FOUND', message: 'Conversation not found' })

      return data
    }),

  /** Update conversation status */
  updateConversation: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        status: z.enum(['active', 'lead', 'booked', 'closed', 'spam']).optional(),
        patient_name: z.string().nullable().optional(),
        patient_email: z.string().email().nullable().optional(),
        patient_phone: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const practiceId = ctx.dbUser.practice_id
      if (!practiceId) throw new TRPCError({ code: 'BAD_REQUEST', message: 'No practice associated' })

      const { id, ...updates } = input
      const { data, error } = await ctx.supabase
        .from('conversations')
        .update(updates)
        .eq('id', id)
        .eq('practice_id', practiceId)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  /** Get leads (conversations with status 'lead') */
  getLeads: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(25),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const practiceId = ctx.dbUser.practice_id
      if (!practiceId) throw new TRPCError({ code: 'BAD_REQUEST', message: 'No practice associated' })

      const { data, count, error } = await ctx.supabase
        .from('conversations')
        .select('*', { count: 'exact' })
        .eq('practice_id', practiceId)
        .eq('status', 'lead')
        .order('created_at', { ascending: false })
        .range(input.offset, input.offset + input.limit - 1)

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

      return { leads: data ?? [], total: count ?? 0 }
    }),

  /** Add a staff note to a conversation */
  addStaffNote: protectedProcedure
    .input(
      z.object({
        conversationId: z.string().uuid(),
        content: z.string().min(1).max(2000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const practiceId = ctx.dbUser.practice_id
      if (!practiceId) throw new TRPCError({ code: 'BAD_REQUEST', message: 'No practice associated' })

      // Verify conversation belongs to practice
      const { data: conv, error: convError } = await ctx.supabase
        .from('conversations')
        .select('id')
        .eq('id', input.conversationId)
        .eq('practice_id', practiceId)
        .single()

      if (convError || !conv) throw new TRPCError({ code: 'NOT_FOUND', message: 'Conversation not found' })

      const { data, error } = await ctx.supabase
        .from('messages')
        .insert({
          practice_id: practiceId,
          conversation_id: input.conversationId,
          role: 'staff',
          content: input.content,
          metadata: { author_id: ctx.dbUser.id, author_name: ctx.dbUser.name },
        })
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),
  /** Get embed code for the practice's chatbot widget */
  getEmbedCode: protectedProcedure.query(async ({ ctx }) => {
    const practiceId = ctx.dbUser.practice_id
    if (!practiceId) throw new TRPCError({ code: 'BAD_REQUEST', message: 'No practice associated' })

    const { data, error } = await ctx.supabase
      .from('chatbot_configs')
      .select('embed_key')
      .eq('practice_id', practiceId)
      .single()

    if (error && error.code !== 'PGRST116') throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

    const embedKey = data?.embed_key ?? null
    if (!embedKey) return { embedKey: null, scriptTag: null }

    const scriptTag = `<script src="https://widget.dentalpilot.com/chat.js" data-embed-key="${embedKey}" async></script>`
    return { embedKey, scriptTag }
  }),

  /** Get dashboard stats */
  getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
    const practiceId = ctx.dbUser.practice_id
    if (!practiceId) throw new TRPCError({ code: 'BAD_REQUEST', message: 'No practice associated' })

    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const [todayResult, weekResult, leadsResult, bookedResult, totalResult] = await Promise.all([
      ctx.supabase
        .from('conversations')
        .select('id', { count: 'exact', head: true })
        .eq('practice_id', practiceId)
        .gte('created_at', todayStart),
      ctx.supabase
        .from('conversations')
        .select('id', { count: 'exact', head: true })
        .eq('practice_id', practiceId)
        .gte('created_at', weekAgo),
      ctx.supabase
        .from('conversations')
        .select('id', { count: 'exact', head: true })
        .eq('practice_id', practiceId)
        .eq('status', 'lead'),
      ctx.supabase
        .from('conversations')
        .select('id', { count: 'exact', head: true })
        .eq('practice_id', practiceId)
        .eq('status', 'booked'),
      ctx.supabase
        .from('conversations')
        .select('id', { count: 'exact', head: true })
        .eq('practice_id', practiceId),
    ])

    const total = totalResult.count ?? 0
    const booked = bookedResult.count ?? 0
    const conversionRate = total > 0 ? Math.round((booked / total) * 100) : 0

    return {
      conversationsToday: todayResult.count ?? 0,
      conversationsThisWeek: weekResult.count ?? 0,
      totalLeads: leadsResult.count ?? 0,
      totalBooked: bookedResult.count ?? 0,
      totalConversations: total,
      conversionRate,
    }
  }),
})
