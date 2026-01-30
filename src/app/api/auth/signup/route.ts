import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { name, email, password, orgName, billingEmail } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // 1. Create auth user
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name },
      })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    // 2. Create organization with 14-day trial
    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + 14)

    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: orgName || `${name}'s Practice`,
        billing_email: billingEmail || email,
        plan_type: 'solo',
        trial_ends_at: trialEndsAt.toISOString(),
        subscription_status: 'trialing',
      })
      .select()
      .single()

    if (orgError) {
      // Clean up: delete the auth user if org creation fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({ error: orgError.message }, { status: 500 })
    }

    // 3. Create user record
    const { error: userError } = await supabase.from('users').insert({
      id: authData.user.id,
      email,
      name,
      role: 'admin',
      organization_id: org.id,
      status: 'active',
      is_org_admin: true,
    })

    if (userError) {
      // Clean up
      await supabase.from('organizations').delete().eq('id', org.id)
      await supabase.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({ error: userError.message }, { status: 500 })
    }

    return NextResponse.json({
      user: { id: authData.user.id, email: authData.user.email },
      organization: { id: org.id, name: org.name },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
