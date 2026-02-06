import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Users,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
} from 'lucide-react'
import Link from 'next/link'
import { formatDate, formatRelativeDate } from '@/lib/utils'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user with practice (use admin client to bypass RLS)
  const adminSupabase = createAdminClient()
  const { data: dbUser } = await adminSupabase
    .from('users')
    .select('*, practices(*)')
    .eq('id', user.id)
    .single()

  if (!dbUser) {
    redirect('/onboarding')
  }

  // If user has no practice, check if org has any practices and assign the first one
  if (!dbUser.practice_id) {
    const { data: practices } = await adminSupabase
      .from('practices')
      .select('id')
      .eq('organization_id', dbUser.organization_id!)
      .limit(1)

    if (!practices || practices.length === 0) {
      redirect('/onboarding')
    }

    // Assign the first practice to this user
    await adminSupabase
      .from('users')
      .update({ practice_id: practices[0].id })
      .eq('id', user.id)

    dbUser.practice_id = practices[0].id
  }

  // Get dashboard data
  const [
    { count: employeeCount },
    { data: assignments },
    { data: upcomingTraining },
    { data: overdueTraining },
    { data: recentActivity },
  ] = await Promise.all([
    // Employee count
    adminSupabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('practice_id', dbUser.practice_id)
      .eq('status', 'active'),

    // All training assignments
    adminSupabase
      .from('training_assignments')
      .select('status, due_date')
      .eq('practice_id', dbUser.practice_id),

    // Upcoming training (due within 30 days)
    adminSupabase
      .from('training_assignments')
      .select('*, users(name), training_modules(title)')
      .eq('practice_id', dbUser.practice_id)
      .neq('status', 'completed')
      .gte('due_date', new Date().toISOString().split('T')[0])
      .lte(
        'due_date',
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      )
      .order('due_date')
      .limit(5),

    // Overdue training
    adminSupabase
      .from('training_assignments')
      .select('*, users(name), training_modules(title)')
      .eq('practice_id', dbUser.practice_id)
      .neq('status', 'completed')
      .lt('due_date', new Date().toISOString().split('T')[0])
      .order('due_date')
      .limit(5),

    // Recent activity (audit log)
    adminSupabase
      .from('audit_log')
      .select('*, users(name)')
      .eq('practice_id', dbUser.practice_id)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  // Calculate stats
  const now = new Date()
  const totalAssignments = assignments?.length || 0
  const completedAssignments =
    assignments?.filter((a) => a.status === 'completed').length || 0
  const overdueAssignments =
    assignments?.filter(
      (a) => a.status !== 'completed' && new Date(a.due_date) < now
    ).length || 0
  const complianceRate =
    totalAssignments > 0
      ? Math.round((completedAssignments / totalAssignments) * 100)
      : 100

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {dbUser.name.split(' ')[0]}. Here&apos;s your compliance overview.
        </p>
      </div>

      {/* Alert Banner */}
      {overdueAssignments > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div>
              <p className="font-medium text-red-900">
                {overdueAssignments} overdue training{overdueAssignments !== 1 ? 's' : ''}
              </p>
              <p className="text-sm text-red-700">
                Action required to maintain compliance
              </p>
            </div>
          </div>
          <Button asChild variant="destructive">
            <Link href="/dashboard/employees?filter=overdue">View all</Link>
          </Button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Compliance Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceRate}%</div>
            <Progress value={complianceRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Employees
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employeeCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Active staff members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Training Complete
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedAssignments}/{totalAssignments}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Assignments completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overdue
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {overdueAssignments}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Require immediate action
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overdue Training */}
        {overdueTraining && overdueTraining.length > 0 && (
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-5 w-5" />
                Overdue Training
              </CardTitle>
              <CardDescription>
                These trainings are past their due date
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {overdueTraining.map((training) => (
                  <div
                    key={training.id}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {(training.users as any)?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {(training.training_modules as any)?.title}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="error">
                        {Math.abs(
                          Math.ceil(
                            (new Date(training.due_date).getTime() - now.getTime()) /
                              (1000 * 60 * 60 * 24)
                          )
                        )}{' '}
                        days overdue
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button asChild variant="outline" className="w-full mt-4">
                <Link href="/dashboard/employees?filter=overdue">
                  View all overdue
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Training */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Upcoming Training
            </CardTitle>
            <CardDescription>Due within the next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingTraining && upcomingTraining.length > 0 ? (
              <div className="space-y-3">
                {upcomingTraining.map((training) => (
                  <div
                    key={training.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {(training.users as any)?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {(training.training_modules as any)?.title}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="warning">
                        Due {formatDate(training.due_date)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No training due in the next 30 days
              </p>
            )}
            <Button asChild variant="outline" className="w-full mt-4">
              <Link href="/dashboard/training">View all training</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for compliance management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/employees/new">
                <Users className="mr-2 h-4 w-4" />
                Add new employee
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/documents">
                <BookOpen className="mr-2 h-4 w-4" />
                View compliance documents
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50">
              <Link href="/dashboard/inspection">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Generate inspection packet
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest compliance events</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity && recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">
                          {(activity.users as any)?.name || 'System'}
                        </span>{' '}
                        {activity.action.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeDate(activity.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No recent activity
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
