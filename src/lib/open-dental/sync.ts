import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/database.types'
import { OpenDentalClient } from './client'

/**
 * Sync providers, operatories, and appointment types from Open Dental
 * into the local Supabase cache for a given practice.
 */
export async function syncOpenDentalData(
  supabase: SupabaseClient<Database>,
  practiceId: string,
  customerApiKey: string
): Promise<{ success: boolean; error?: string }> {
  const odClient = new OpenDentalClient(customerApiKey)

  try {
    const [providers, operatories, appointmentTypes] = await Promise.all([
      odClient.getProviders(),
      odClient.getOperatories(),
      odClient.getAppointmentTypes(),
    ])

    const now = new Date().toISOString()

    // Upsert providers
    if (providers.length > 0) {
      const { error: provError } = await supabase
        .from('od_providers')
        .upsert(
          providers.map((p) => ({
            practice_id: practiceId,
            od_provider_num: p.ProvNum,
            abbr: p.Abbr,
            first_name: p.FName,
            last_name: p.LName,
            is_hygienist: p.IsHygienist,
            is_hidden: p.IsHidden,
            synced_at: now,
          })),
          { onConflict: 'practice_id,od_provider_num' }
        )
      if (provError) throw provError
    }

    // Upsert operatories
    if (operatories.length > 0) {
      const { error: opError } = await supabase
        .from('od_operatories')
        .upsert(
          operatories.map((o) => ({
            practice_id: practiceId,
            od_operatory_num: o.OperatoryNum,
            op_name: o.OpName,
            provider_num: o.ProvDentist,
            hygienist_num: o.ProvHygienist,
            is_hidden: o.IsHidden,
            synced_at: now,
          })),
          { onConflict: 'practice_id,od_operatory_num' }
        )
      if (opError) throw opError
    }

    // Upsert appointment types
    if (appointmentTypes.length > 0) {
      const { error: atError } = await supabase
        .from('od_appointment_types')
        .upsert(
          appointmentTypes.map((at) => ({
            practice_id: practiceId,
            od_appointment_type_num: at.AppointmentTypeNum,
            type_name: at.AppointmentTypeName,
            pattern: at.Pattern,
            synced_at: now,
          })),
          { onConflict: 'practice_id,od_appointment_type_num' }
        )
      if (atError) throw atError
    }

    // Update last sync timestamp
    await supabase
      .from('open_dental_configs')
      .update({ last_sync_at: now, sync_error: null })
      .eq('practice_id', practiceId)

    return { success: true }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)

    // Record sync failure
    await supabase
      .from('open_dental_configs')
      .update({ sync_error: errorMessage })
      .eq('practice_id', practiceId)

    return { success: false, error: errorMessage }
  }
}
