import { z } from 'zod'
import { router, adminProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'

export const inspectionRouter = router({
  // Generate inspection packet
  generatePacket: adminProcedure
    .input(z.object({ practiceId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const now = new Date()
      const threeYearsAgo = new Date(now.getTime() - 3 * 365 * 24 * 60 * 60 * 1000)

      // Gather all compliance data
      const [
        { data: practice },
        { data: employees },
        { data: trainingAssignments },
        { data: vaccinations },
        { data: incidents },
        { data: documents },
      ] = await Promise.all([
        // Practice info
        ctx.supabase
          .from('practices')
          .select('*, organizations(name)')
          .eq('id', input.practiceId)
          .single(),

        // Employees
        ctx.supabase
          .from('users')
          .select('*')
          .eq('practice_id', input.practiceId)
          .neq('status', 'inactive'),

        // Training records (last 3 years)
        ctx.supabase
          .from('training_assignments')
          .select('*, users(name), training_modules(title, type)')
          .eq('practice_id', input.practiceId)
          .gte('created_at', threeYearsAgo.toISOString())
          .order('completed_at', { ascending: false }),

        // Vaccination records
        ctx.supabase
          .from('vaccination_records')
          .select('*, users(name)')
          .eq('practice_id', input.practiceId),

        // Incident reports (last 3 years)
        ctx.supabase
          .from('incident_reports')
          .select('*, users:reported_by_user_id(name)')
          .eq('practice_id', input.practiceId)
          .gte('incident_date', threeYearsAgo.toISOString().split('T')[0])
          .order('incident_date', { ascending: false }),

        // Documents
        ctx.supabase
          .from('documents')
          .select('*')
          .eq('practice_id', input.practiceId)
          .in('type', ['exposure_control_plan', 'manual', 'policy']),
      ])

      if (!practice) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Practice not found' })
      }

      // Calculate compliance gaps
      const complianceGaps: string[] = []

      // Check for overdue training
      const overdueTraining = trainingAssignments?.filter(
        (a) => a.status !== 'completed' && new Date(a.due_date) < now
      ) || []

      if (overdueTraining.length > 0) {
        overdueTraining.forEach((t) => {
          complianceGaps.push(
            `Overdue training: ${(t.users as any)?.name} - ${(t.training_modules as any)?.title}`
          )
        })
      }

      // Check for missing Hep B records
      const hepBRecords = vaccinations?.filter((v) => v.vaccine_type === 'hep_b') || []
      const missingHepB = employees?.filter(
        (e) => !hepBRecords.some((v) => v.user_id === e.id)
      ) || []

      if (missingHepB.length > 0) {
        missingHepB.forEach((e) => {
          complianceGaps.push(`Missing Hepatitis B documentation: ${e.name}`)
        })
      }

      // Check for unsigned Hep B records
      const pendingHepB = hepBRecords.filter(
        (v) => v.status === 'not_started' || v.status === 'in_progress'
      )
      if (pendingHepB.length > 0) {
        pendingHepB.forEach((v) => {
          complianceGaps.push(
            `Incomplete Hepatitis B status: ${(v.users as any)?.name}`
          )
        })
      }

      // Check for missing ECP
      const hasECP = documents?.some((d) => d.type === 'exposure_control_plan')
      if (!hasECP) {
        complianceGaps.push('Missing Exposure Control Plan')
      }

      // Create audit log entry
      await ctx.supabase.from('audit_log').insert({
        organization_id: ctx.dbUser.organization_id,
        practice_id: input.practiceId,
        user_id: ctx.user.id,
        action: 'generate_inspection_packet',
        entity_type: 'practice',
        entity_id: input.practiceId,
        new_values: { generated_at: now.toISOString() },
      })

      return {
        practice,
        generatedAt: now.toISOString(),
        complianceGaps,
        isCompliant: complianceGaps.length === 0,
        data: {
          employees: employees || [],
          trainingRecords: trainingAssignments || [],
          vaccinationRecords: vaccinations || [],
          incidentReports: incidents || [],
          documents: documents || [],
        },
        summary: {
          totalEmployees: employees?.length || 0,
          trainingCompleted: trainingAssignments?.filter((t) => t.status === 'completed').length || 0,
          trainingOverdue: overdueTraining.length,
          vaccinationsComplete: hepBRecords.filter((v) => v.status === 'vaccinated' || v.status === 'declined').length,
          incidentCount: incidents?.length || 0,
        },
      }
    }),

  // Get pre-inspection checklist
  getChecklist: adminProcedure
    .input(z.object({ practiceId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const now = new Date()

      const [
        { data: employees },
        { data: assignments },
        { data: vaccinations },
        { data: documents },
      ] = await Promise.all([
        ctx.supabase
          .from('users')
          .select('id, name')
          .eq('practice_id', input.practiceId)
          .eq('status', 'active'),

        ctx.supabase
          .from('training_assignments')
          .select('*, users(name), training_modules(title)')
          .eq('practice_id', input.practiceId)
          .neq('status', 'completed'),

        ctx.supabase
          .from('vaccination_records')
          .select('*, users(name)')
          .eq('practice_id', input.practiceId)
          .eq('vaccine_type', 'hep_b')
          .not('status', 'in', '("vaccinated","declined")'),

        ctx.supabase
          .from('documents')
          .select('type, title, last_reviewed_at')
          .eq('practice_id', input.practiceId),
      ])

      const checklist = []

      // Training items
      const overdueAssignments = assignments?.filter(
        (a) => new Date(a.due_date) < now
      ) || []

      overdueAssignments.forEach((a) => {
        checklist.push({
          type: 'training',
          severity: 'critical',
          title: `Complete overdue training`,
          description: `${(a.users as any)?.name} - ${(a.training_modules as any)?.title}`,
          action: 'send_reminder',
          entityId: a.id,
        })
      })

      // Vaccination items
      vaccinations?.forEach((v) => {
        checklist.push({
          type: 'vaccination',
          severity: 'warning',
          title: 'Complete Hepatitis B documentation',
          description: `${(v.users as any)?.name} - Status: ${v.status}`,
          action: 'update_vaccination',
          entityId: v.id,
        })
      })

      // Document items
      const hasECP = documents?.some((d) => d.type === 'exposure_control_plan')
      if (!hasECP) {
        checklist.push({
          type: 'document',
          severity: 'critical',
          title: 'Create Exposure Control Plan',
          description: 'Required OSHA document is missing',
          action: 'generate_ecp',
          entityId: null,
        })
      }

      // Check for outdated ECP
      const ecp = documents?.find((d) => d.type === 'exposure_control_plan')
      if (ecp && ecp.last_reviewed_at) {
        const lastReview = new Date(ecp.last_reviewed_at)
        const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        if (lastReview < oneYearAgo) {
          checklist.push({
            type: 'document',
            severity: 'warning',
            title: 'Review Exposure Control Plan',
            description: 'Annual review is overdue',
            action: 'review_document',
            entityId: ecp.type,
          })
        }
      }

      return {
        isReady: checklist.filter((c) => c.severity === 'critical').length === 0,
        criticalCount: checklist.filter((c) => c.severity === 'critical').length,
        warningCount: checklist.filter((c) => c.severity === 'warning').length,
        items: checklist,
      }
    }),
})
