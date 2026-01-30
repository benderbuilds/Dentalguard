import { z } from 'zod'
import { router, protectedProcedure, adminProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'

export const trainingRouter = router({
  // Get all available training modules
  listModules: protectedProcedure
    .input(z.object({
      type: z.enum(['osha', 'hipaa', 'hazcom', 'emergency', 'state']).optional(),
    }))
    .query(async ({ ctx, input }) => {
      const query = ctx.supabase
        .from('training_modules')
        .select('*')
        .eq('is_active', true)
        .order('title')

      if (input.type) {
        query.eq('type', input.type)
      }

      const { data, error } = await query
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // Get a single module by ID
  getModule: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('training_modules')
        .select('*')
        .eq('id', input.id)
        .single()

      if (error) throw new TRPCError({ code: 'NOT_FOUND', message: 'Module not found' })
      return data
    }),

  // Get user's training assignments
  myAssignments: protectedProcedure
    .input(z.object({
      status: z.enum(['pending', 'in_progress', 'completed', 'overdue']).optional(),
    }))
    .query(async ({ ctx, input }) => {
      const query = ctx.supabase
        .from('training_assignments')
        .select('*, training_modules(*)')
        .eq('user_id', ctx.user.id)
        .order('due_date')

      if (input.status) {
        query.eq('status', input.status)
      }

      const { data, error } = await query
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // Get a specific assignment
  getAssignment: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('training_assignments')
        .select('*, training_modules(*)')
        .eq('id', input.id)
        .single()

      if (error) throw new TRPCError({ code: 'NOT_FOUND', message: 'Assignment not found' })

      // Verify the user has access
      if (data.user_id !== ctx.user.id && ctx.dbUser.role === 'employee') {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }

      return data
    }),

  // Start a training module
  startTraining: protectedProcedure
    .input(z.object({ assignmentId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('training_assignments')
        .update({
          status: 'in_progress',
          started_at: new Date().toISOString(),
        })
        .eq('id', input.assignmentId)
        .eq('user_id', ctx.user.id)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // Update progress through a module
  updateProgress: protectedProcedure
    .input(z.object({
      assignmentId: z.string().uuid(),
      progress: z.record(z.any()),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('training_assignments')
        .update({
          progress_json: input.progress,
        })
        .eq('id', input.assignmentId)
        .eq('user_id', ctx.user.id)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // Submit quiz answers and complete training
  submitQuiz: protectedProcedure
    .input(z.object({
      assignmentId: z.string().uuid(),
      answers: z.record(z.number()),
      signatureName: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      // Get the assignment and module
      const { data: assignment, error: assignmentError } = await ctx.supabase
        .from('training_assignments')
        .select('*, training_modules(*)')
        .eq('id', input.assignmentId)
        .eq('user_id', ctx.user.id)
        .single()

      if (assignmentError || !assignment) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Assignment not found' })
      }

      const trainingModule = assignment.training_modules
      const quiz = (trainingModule.content_json as any)?.quiz
      if (!quiz) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Module has no quiz' })
      }

      // Calculate score
      let correctCount = 0
      const questions = quiz.questions || []
      questions.forEach((q: any) => {
        if (input.answers[q.id] === q.correct) {
          correctCount++
        }
      })

      const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 100
      const passed = score >= trainingModule.passing_score

      // Update the assignment
      const updateData: any = {
        score,
        attempts: assignment.attempts + 1,
        progress_json: {
          ...((assignment.progress_json as any) || {}),
          lastQuizAnswers: input.answers,
          lastQuizScore: score,
        },
      }

      if (passed) {
        updateData.status = 'completed'
        updateData.completed_at = new Date().toISOString()
        updateData.signature_name = input.signatureName
        updateData.signature_timestamp = new Date().toISOString()
        // Certificate URL would be generated here
        updateData.certificate_url = `/api/certificates/${input.assignmentId}`
      }

      const { data, error } = await ctx.supabase
        .from('training_assignments')
        .update(updateData)
        .eq('id', input.assignmentId)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

      // Update streak if passed
      if (passed) {
        const today = new Date().toISOString().split('T')[0]
        const { data: streak } = await ctx.supabase
          .from('user_streaks')
          .select('*')
          .eq('user_id', ctx.user.id)
          .single()

        if (streak) {
          const lastDate = streak.last_completion_date
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

          let newStreak = streak.current_streak
          if (lastDate === yesterday || lastDate === today) {
            newStreak = streak.current_streak + 1
          } else if (lastDate !== today) {
            newStreak = 1
          }

          await ctx.supabase.from('user_streaks').update({
            current_streak: newStreak,
            longest_streak: Math.max(newStreak, streak.longest_streak),
            last_completion_date: today,
          }).eq('user_id', ctx.user.id)
        } else {
          await ctx.supabase.from('user_streaks').insert({
            user_id: ctx.user.id,
            current_streak: 1,
            longest_streak: 1,
            last_completion_date: today,
          })
        }

        // Check for badges
        await checkAndAwardBadges(ctx.supabase, ctx.user.id, score)
      }

      return {
        ...data,
        passed,
        score,
        passingScore: trainingModule.passing_score,
      }
    }),

  // Admin: Assign training to an employee
  assignTraining: adminProcedure
    .input(z.object({
      userId: z.string().uuid(),
      moduleId: z.string().uuid(),
      dueDate: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify the user belongs to the admin's organization
      const { data: user } = await ctx.supabase
        .from('users')
        .select('practice_id')
        .eq('id', input.userId)
        .eq('organization_id', ctx.dbUser.organization_id!)
        .single()

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Employee not found' })
      }

      if (!user.practice_id) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Employee is not assigned to a practice. Please assign them to a practice first.',
        })
      }

      const { data, error } = await ctx.supabase
        .from('training_assignments')
        .insert({
          user_id: input.userId,
          module_id: input.moduleId,
          practice_id: user.practice_id,
          due_date: input.dueDate,
          status: 'pending',
        })
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // Admin: Get all assignments for a practice
  listAssignments: adminProcedure
    .input(z.object({
      practiceId: z.string().uuid().optional(),
      status: z.enum(['pending', 'in_progress', 'completed', 'overdue']).optional(),
    }))
    .query(async ({ ctx, input }) => {
      let query = ctx.supabase
        .from('training_assignments')
        .select('*, users(name, email), training_modules(title, type)')
        .order('due_date')

      if (input.practiceId) {
        query = query.eq('practice_id', input.practiceId)
      }

      if (input.status) {
        query = query.eq('status', input.status)
      }

      const { data, error } = await query
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // Get training stats for dashboard
  getStats: protectedProcedure
    .input(z.object({ practiceId: z.string().uuid().optional() }))
    .query(async ({ ctx, input }) => {
      const query = ctx.supabase
        .from('training_assignments')
        .select('status, due_date')

      if (input.practiceId) {
        query.eq('practice_id', input.practiceId)
      }

      const { data, error } = await query
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

      const now = new Date()
      const stats = {
        total: data?.length || 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
        overdue: 0,
      }

      data?.forEach((assignment) => {
        if (assignment.status === 'completed') {
          stats.completed++
        } else if (assignment.status === 'in_progress') {
          stats.inProgress++
        } else if (new Date(assignment.due_date) < now) {
          stats.overdue++
        } else {
          stats.pending++
        }
      })

      return stats
    }),
})

async function checkAndAwardBadges(supabase: any, userId: string, score: number) {
  // Check for first training badge
  const { data: completedCount } = await supabase
    .from('training_assignments')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
    .eq('status', 'completed')

  if (completedCount?.length === 1) {
    // Award "First Training" badge
    const { data: badge } = await supabase
      .from('badges')
      .select('id')
      .eq('name', 'First Training')
      .single()

    if (badge) {
      await supabase.from('user_badges').upsert({
        user_id: userId,
        badge_id: badge.id,
      }, { onConflict: 'user_id,badge_id' })
    }
  }

  // Check for perfect score badge
  if (score === 100) {
    const { data: badge } = await supabase
      .from('badges')
      .select('id')
      .eq('name', 'Perfect Score')
      .single()

    if (badge) {
      await supabase.from('user_badges').upsert({
        user_id: userId,
        badge_id: badge.id,
      }, { onConflict: 'user_id,badge_id' })
    }
  }

  // Check for streak badge
  const { data: streak } = await supabase
    .from('user_streaks')
    .select('current_streak')
    .eq('user_id', userId)
    .single()

  if (streak?.current_streak >= 5) {
    const { data: badge } = await supabase
      .from('badges')
      .select('id')
      .eq('name', 'Streak Master')
      .single()

    if (badge) {
      await supabase.from('user_badges').upsert({
        user_id: userId,
        badge_id: badge.id,
      }, { onConflict: 'user_id,badge_id' })
    }
  }
}
