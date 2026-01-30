'use client'

import { useState } from 'react'
import Link from 'next/link'
import { trpc } from '@/lib/trpc/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BookOpen,
  Clock,
  CheckCircle,
  AlertTriangle,
  Play,
  Award,
  Plus,
} from 'lucide-react'
import { formatDate, formatRelativeDate } from '@/lib/utils'
import { AssignTrainingDialog } from '@/components/training/assign-training-dialog'

export default function TrainingPage() {
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)

  const utils = trpc.useUtils()
  const { data: myAssignments, isLoading: loadingAssignments } =
    trpc.training.myAssignments.useQuery({})

  const { data: modules, isLoading: loadingModules } =
    trpc.training.listModules.useQuery({})

  const { data: stats } = trpc.training.getStats.useQuery({})

  // Check if user has admin access (listAssignments is admin-only)
  const { data: adminAssignments } = trpc.training.listAssignments.useQuery(
    {},
    { retry: false }
  )
  const isAdmin = adminAssignments !== undefined

  const now = new Date()

  // Group assignments by status
  const overdueAssignments =
    myAssignments?.filter(
      (a) => a.status !== 'completed' && new Date(a.due_date) < now
    ) || []

  const pendingAssignments =
    myAssignments?.filter(
      (a) => a.status !== 'completed' && new Date(a.due_date) >= now
    ) || []

  const completedAssignments =
    myAssignments?.filter((a) => a.status === 'completed') || []

  const completionRate =
    myAssignments && myAssignments.length > 0
      ? Math.round((completedAssignments.length / myAssignments.length) * 100)
      : 0

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Training</h1>
          <p className="text-muted-foreground">
            Complete your required compliance training modules
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setAssignDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Assign Training
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {completedAssignments.length}
            </div>
            <p className="text-xs text-muted-foreground">trainings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingAssignments.length}
            </div>
            <p className="text-xs text-muted-foreground">to complete</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {overdueAssignments.length}
            </div>
            <p className="text-xs text-muted-foreground">need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Training Tabs */}
      <Tabs defaultValue="my-training" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-training">My Training</TabsTrigger>
          <TabsTrigger value="all-modules">All Modules</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="my-training" className="space-y-4">
          {/* Overdue Alert */}
          {overdueAssignments.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                  Overdue Training
                </CardTitle>
                <CardDescription className="text-red-600">
                  Complete these trainings immediately to maintain compliance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {overdueAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-100"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {(assignment.training_modules as any)?.title}
                        </p>
                        <p className="text-sm text-red-600">
                          Due {formatDate(assignment.due_date)} - Overdue
                        </p>
                      </div>
                    </div>
                    <Button asChild>
                      <Link href={`/training/${assignment.id}`}>
                        <Play className="mr-2 h-4 w-4" />
                        Start Now
                      </Link>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Pending Training */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Training</CardTitle>
              <CardDescription>
                Training modules due in the coming weeks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {loadingAssignments ? (
                <p className="text-muted-foreground text-center py-4">
                  Loading...
                </p>
              ) : pendingAssignments.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="font-medium">All caught up!</p>
                  <p className="text-sm text-muted-foreground">
                    No pending training at this time
                  </p>
                </div>
              ) : (
                pendingAssignments.map((assignment) => {
                  const dueDate = new Date(assignment.due_date)
                  const daysUntilDue = Math.ceil(
                    (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
                  )
                  const isDueSoon = daysUntilDue <= 7

                  return (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {(assignment.training_modules as any)?.title}
                          </p>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {(assignment.training_modules as any)?.duration_minutes} min
                            </span>
                            <span className="text-muted-foreground">·</span>
                            <span
                              className={`text-sm ${
                                isDueSoon ? 'text-yellow-600' : 'text-muted-foreground'
                              }`}
                            >
                              Due {formatDate(assignment.due_date)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isDueSoon && (
                          <Badge variant="warning">Due Soon</Badge>
                        )}
                        <Button asChild>
                          <Link href={`/training/${assignment.id}`}>
                            {assignment.status === 'in_progress'
                              ? 'Continue'
                              : 'Start'}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all-modules">
          <Card>
            <CardHeader>
              <CardTitle>Training Modules</CardTitle>
              <CardDescription>
                All available compliance training modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loadingModules ? (
                  <p className="text-muted-foreground">Loading modules...</p>
                ) : (
                  modules?.map((module) => (
                    <Card key={module.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{module.title}</CardTitle>
                          <Badge variant="secondary" className="capitalize">
                            {module.type}
                          </Badge>
                        </div>
                        <CardDescription>{module.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {module.duration_minutes} min
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            {module.passing_score}% to pass
                          </div>
                          <div className="flex items-center gap-1">
                            <Award className="h-4 w-4" />
                            Every {module.frequency_months} months
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Training</CardTitle>
              <CardDescription>Your training history and certificates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {completedAssignments.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No completed training yet
                </p>
              ) : (
                completedAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {(assignment.training_modules as any)?.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Completed {formatRelativeDate(assignment.completed_at!)} ·
                          Score: {assignment.score}%
                        </p>
                      </div>
                    </div>
                    {assignment.certificate_url && (
                      <Button variant="outline" asChild>
                        <a
                          href={assignment.certificate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Award className="mr-2 h-4 w-4" />
                          Certificate
                        </a>
                      </Button>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AssignTrainingDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        onSuccess={() => {
          utils.training.myAssignments.invalidate()
          utils.training.listAssignments.invalidate()
          utils.training.getStats.invalidate()
        }}
      />
    </div>
  )
}
