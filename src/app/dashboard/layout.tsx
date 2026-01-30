import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user details with organization and practice (use admin client to bypass RLS)
  const adminSupabase = createAdminClient()
  const { data: dbUser } = await adminSupabase
    .from('users')
    .select(`
      *,
      organizations(*),
      practices(*)
    `)
    .eq('id', user.id)
    .single()

  if (!dbUser) {
    // User exists in auth but not in our database - redirect to onboarding
    redirect('/onboarding')
  }

  // Get compliance stats for the sidebar
  const { data: complianceData } = dbUser.practice_id
    ? await adminSupabase
        .from('training_assignments')
        .select('status, due_date')
        .eq('practice_id', dbUser.practice_id)
    : { data: [] }

  const now = new Date()
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  const complianceStats = {
    overdueCount: complianceData?.filter(
      (a) => a.status !== 'completed' && new Date(a.due_date) < now
    ).length || 0,
    dueSoonCount: complianceData?.filter(
      (a) =>
        a.status !== 'completed' &&
        new Date(a.due_date) >= now &&
        new Date(a.due_date) <= thirtyDaysFromNow
    ).length || 0,
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar complianceStats={complianceStats} />
      <div className="flex-1 flex flex-col">
        <Header
          user={{
            name: dbUser.name,
            email: dbUser.email,
            avatar_url: dbUser.avatar_url,
            role: dbUser.role,
          }}
          organization={dbUser.organizations ?? undefined}
          practice={dbUser.practices ?? undefined}
        />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
