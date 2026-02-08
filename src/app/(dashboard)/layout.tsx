import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user details with organization and practice (admin client bypasses RLS)
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
    redirect('/onboarding')
  }

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <Sidebar
        user={{
          name: dbUser.name,
          email: dbUser.email,
          avatar_url: dbUser.avatar_url,
          role: dbUser.role,
        }}
        practiceName={dbUser.practices?.name}
        plan="engage"
      />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 pt-[72px] md:p-6 lg:p-8 md:pt-6 lg:pt-8">
          {children}
        </main>
      </div>
    </div>
  )
}
