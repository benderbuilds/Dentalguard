import { z } from 'zod'
import { router, protectedProcedure, adminProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'

export const documentsRouter = router({
  // List all documents for a practice
  list: protectedProcedure
    .input(z.object({
      practiceId: z.string().uuid().optional(),
      type: z.enum(['exposure_control_plan', 'manual', 'form', 'certificate', 'policy']).optional(),
    }))
    .query(async ({ ctx, input }) => {
      const practiceId = input.practiceId || ctx.dbUser.practice_id

      if (!practiceId) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Practice ID required' })
      }

      let query = ctx.supabase
        .from('documents')
        .select('*')
        .eq('practice_id', practiceId)
        .order('updated_at', { ascending: false })

      if (input.type) {
        query = query.eq('type', input.type)
      }

      const { data, error } = await query
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // Get a single document
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('documents')
        .select('*, document_signatures(*, users(name, email))')
        .eq('id', input.id)
        .single()

      if (error) throw new TRPCError({ code: 'NOT_FOUND', message: 'Document not found' })

      // Verify access
      const { data: practice } = await ctx.supabase
        .from('practices')
        .select('organization_id')
        .eq('id', data.practice_id)
        .single()

      if (practice?.organization_id !== ctx.dbUser.organization_id) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }

      return data
    }),

  // Create a new document
  create: adminProcedure
    .input(z.object({
      practiceId: z.string().uuid(),
      type: z.enum(['exposure_control_plan', 'manual', 'form', 'certificate', 'policy']),
      title: z.string().min(1),
      description: z.string().optional(),
      content: z.string().optional(),
      isTemplate: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('documents')
        .insert({
          practice_id: input.practiceId,
          type: input.type,
          title: input.title,
          description: input.description || null,
          content: input.content || null,
          is_template: input.isTemplate,
          created_by_user_id: ctx.user.id,
        })
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // Update a document
  update: adminProcedure
    .input(z.object({
      id: z.string().uuid(),
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      content: z.string().optional(),
      metadata: z.record(z.any()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input

      // Get current document to increment version
      const { data: current } = await ctx.supabase
        .from('documents')
        .select('version')
        .eq('id', id)
        .single()

      const updateData: any = {
        version: (current?.version || 0) + 1,
      }
      if (updates.title !== undefined) updateData.title = updates.title
      if (updates.description !== undefined) updateData.description = updates.description
      if (updates.content !== undefined) updateData.content = updates.content
      if (updates.metadata !== undefined) updateData.metadata = updates.metadata

      const { data, error } = await ctx.supabase
        .from('documents')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // Delete a document
  delete: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase
        .from('documents')
        .delete()
        .eq('id', input.id)

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return { success: true }
    }),

  // Sign a document
  sign: protectedProcedure
    .input(z.object({
      documentId: z.string().uuid(),
      signatureName: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('document_signatures')
        .insert({
          document_id: input.documentId,
          user_id: ctx.user.id,
          signature_name: input.signatureName,
        })
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // Generate Exposure Control Plan using AI
  generateECP: adminProcedure
    .input(z.object({
      practiceId: z.string().uuid(),
      practiceInfo: z.object({
        name: z.string(),
        address: z.string(),
        state: z.string(),
        servicesOffered: z.array(z.string()),
        employeeCount: z.number(),
        hasOralSurgery: z.boolean(),
        hasOrtho: z.boolean(),
        equipmentUsed: z.array(z.string()),
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      // In production, this would call OpenAI to generate the ECP
      // For now, we'll create a template-based ECP

      const ecpContent = generateECPTemplate(input.practiceInfo)

      const { data, error } = await ctx.supabase
        .from('documents')
        .insert({
          practice_id: input.practiceId,
          type: 'exposure_control_plan',
          title: `Exposure Control Plan - ${input.practiceInfo.name}`,
          description: 'Auto-generated Exposure Control Plan based on practice profile',
          content: ecpContent,
          is_auto_generated: true,
          created_by_user_id: ctx.user.id,
          metadata: {
            generatedAt: new Date().toISOString(),
            practiceInfo: input.practiceInfo,
          },
        })
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // Mark document as reviewed
  markReviewed: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('documents')
        .update({
          last_reviewed_at: new Date().toISOString(),
          last_reviewed_by_user_id: ctx.user.id,
        })
        .eq('id', input.id)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),
})

function generateECPTemplate(info: {
  name: string
  address: string
  state: string
  servicesOffered: string[]
  employeeCount: number
  hasOralSurgery: boolean
  hasOrtho: boolean
  equipmentUsed: string[]
}) {
  return `
# EXPOSURE CONTROL PLAN

## ${info.name}
${info.address}

**Effective Date:** ${new Date().toLocaleDateString()}
**Review Date:** ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}

---

## 1. PURPOSE AND SCOPE

This Exposure Control Plan (ECP) is designed to eliminate or minimize employee exposure to bloodborne pathogens in accordance with OSHA Bloodborne Pathogens Standard, 29 CFR 1910.1030.

This plan applies to all employees at ${info.name} who have occupational exposure to blood or other potentially infectious materials (OPIM).

---

## 2. EXPOSURE DETERMINATION

### Job Classifications with Occupational Exposure:

**Category A - All employees in these positions have occupational exposure:**
- Dentists
- Dental Hygienists
- Dental Assistants
- Oral Surgeons (if applicable)

**Category B - Some employees in these positions have occupational exposure:**
- Front Office Staff (when handling contaminated instruments or assisting in clinical areas)
- Sterilization Technicians

### Tasks and Procedures with Occupational Exposure:

${info.servicesOffered.map(service => `- ${service}`).join('\n')}
- Instrument sterilization and processing
- Handling sharps and contaminated waste
- Cleaning and disinfection of treatment areas

---

## 3. METHODS OF IMPLEMENTATION AND CONTROL

### A. Universal Precautions
All blood and OPIM are treated as if known to be infectious for bloodborne pathogens.

### B. Engineering Controls
${info.equipmentUsed.includes('Safety syringes') ? '- Safety-engineered sharps devices\n' : ''}- Puncture-resistant sharps containers
- Handwashing facilities in each treatment area
- Eyewash stations
- Proper ventilation systems

### C. Work Practice Controls
- Handwashing after glove removal
- No eating, drinking, or cosmetics application in work areas
- No recapping of needles (unless using one-handed technique)
- Proper sharps disposal procedures

### D. Personal Protective Equipment (PPE)
Required PPE includes:
- Disposable gloves
- Face masks
- Protective eyewear or face shields
- Lab coats or gowns
- Surgical caps (for surgical procedures)

---

## 4. HEPATITIS B VACCINATION

All employees with occupational exposure are offered the Hepatitis B vaccination series at no cost within 10 days of initial assignment.

Employees who decline must sign a declination form. They may request the vaccination at any time during employment.

---

## 5. POST-EXPOSURE EVALUATION AND FOLLOW-UP

In the event of an exposure incident:
1. Immediately wash/flush the exposed area
2. Report to supervisor immediately
3. Complete Exposure Incident Report form
4. Seek medical evaluation within 24 hours
5. Document source individual status (if known)

---

## 6. TRAINING

All employees with occupational exposure receive training:
- At time of initial assignment
- Annually thereafter
- When new procedures or equipment are introduced

Training covers:
- Bloodborne pathogens and transmission
- This Exposure Control Plan
- Engineering and work practice controls
- PPE selection and use
- Hepatitis B vaccination
- Emergency procedures
- Signs and labels

---

## 7. RECORDKEEPING

### Training Records (maintained for 3 years):
- Training dates
- Content summary
- Trainer name and qualifications
- Employee names and job titles

### Medical Records (maintained for duration of employment + 30 years):
- Hepatitis B vaccination status
- Exposure incident documentation
- Medical evaluation results

---

## 8. PLAN REVIEW

This Exposure Control Plan is reviewed and updated:
- At least annually
- When new tasks or procedures affect occupational exposure
- When new positions are created with occupational exposure

---

**Plan Administrator:** Practice Administrator
**Last Updated:** ${new Date().toLocaleDateString()}
**Next Review Due:** ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}
`
}
