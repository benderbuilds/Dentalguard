'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/use-toast'
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Download,
  Award,
  UserMinus,
  UserPlus,
  Plus,
} from 'lucide-react'
import { formatDate, formatRelativeDate } from '@/lib/utils'
import { AssignTrainingDialog } from '@/components/training/assign-training-dialog'

export default function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)

  const { data: employee, isLoading, refetch } = trpc.employees.getById.useQuery({ id })

  const sendReminder = trpc.employees.sendReminder.useMutation({
    onSuccess: () => {
      toast({
        title: 'Reminder sent',
        description: 'A reminder email has been sent to the employee.',
      })
    },
  })

  const deactivate = trpc.employees.deactivate.useMutation({
    onSuccess: () => {
      toast({
        title: 'Employee deactivated',
        description: 'The employee has been deactivated but records are preserved.',
      })
      refetch()
    },
  })

  const reactivate = trpc.employees.reactivate.useMutation({
    onSuccess: () => {
      toast({
        title: 'Employee reactivated',
        description: 'The employee has been reactivated.',
      })
      refetch()
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading employee details...</p>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground mb-4">Employee not found</p>
        <Button asChild>
          <Link href="/dashboard/employees">Back to employees</Link>
        </Button>
      </div>
    )
  }

  const initials = employee.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const now = new Date()
  const trainingAssignments = employee.training_assignments || []
  const overdueCount = trainingAssignments.filter(
    (a: any) => a.status !== 'completed' && new Date(a.due_date) < now
  ).length

  const hepBRecord = employee.vaccination_records?.find(
    (v: any) => v.vaccine_type === 'hep_b'
  )

  const badges = employee.user_badges || []
  const streak = employee.user_streaks

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/employees">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <Avatar className="h-12 w-12">
            <AvatarImage src={employee.avatar_url || undefined} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{employee.name}</h1>
            <div className="flex items-center gap-2">
              <Badge variant={employee.status === 'active' ? 'success' : 'secondary'}>
                {employee.status}
              </Badge>
              {overdueCount > 0 && (
                <Badge variant="error">{overdueCount} overdue</Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => sendReminder.mutate({ userId: employee.id })}
          >
            <Mail className="mr-2 h-4 w-4" />
            Send Reminder
          </Button>
          {employee.status === 'active' ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-red-600">
                  <UserMinus className="mr-2 h-4 w-4" />
                  Deactivate
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Deactivate Employee</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will deactivate {employee.name}. Their records will be
                    preserved for compliance purposes (OSHA requires 3+ years
                    retention). They will no longer appear in the active employee
                    list.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deactivate.mutate({ id: employee.id })}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Deactivate
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button
              variant="outline"
              onClick={() => reactivate.mutate({ id: employee.id })}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Reactivate
            </Button>
          )}
        </div>
      </div>

      {/* Employee Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a
                href={`mailto:${employee.email}`}
                className="text-sm hover:underline"
              >
                {employee.email}
              </a>
            </div>
            {employee.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{employee.phone}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Employment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm capitalize">
                {employee.job_title || employee.role}
              </span>
            </div>
            {employee.hire_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Hired {formatDate(employee.hire_date)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {badges.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {badges.map((ub: any) => (
                  <Badge key={ub.id} variant="secondary">
                    <Award className="mr-1 h-3 w-3" />
                    {ub.badges?.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No badges earned yet</p>
            )}
            {streak && streak.current_streak > 0 && (
              <p className="text-sm mt-2">
                Current streak: {streak.current_streak} trainings on time
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="training" className="space-y-4">
        <TabsList>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="vaccination">Vaccination</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="training">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>Training Assignments</CardTitle>
                <CardDescription>
                  All required training modules and their completion status
                </CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => setAssignDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Assign Training
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Training</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Certificate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainingAssignments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No training assignments
                      </TableCell>
                    </TableRow>
                  ) : (
                    trainingAssignments.map((assignment: any) => {
                      const isOverdue =
                        assignment.status !== 'completed' &&
                        new Date(assignment.due_date) < now
                      const isDueSoon =
                        !isOverdue &&
                        assignment.status !== 'completed' &&
                        new Date(assignment.due_date) <
                          new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

                      return (
                        <TableRow key={assignment.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {assignment.training_modules?.title}
                              </p>
                              <p className="text-sm text-muted-foreground capitalize">
                                {assignment.training_modules?.type}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(assignment.due_date)}</TableCell>
                          <TableCell>
                            {assignment.status === 'completed' ? (
                              <Badge variant="success">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Completed
                              </Badge>
                            ) : isOverdue ? (
                              <Badge variant="error">
                                <XCircle className="mr-1 h-3 w-3" />
                                Overdue
                              </Badge>
                            ) : isDueSoon ? (
                              <Badge variant="warning">
                                <AlertTriangle className="mr-1 h-3 w-3" />
                                Due Soon
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <Clock className="mr-1 h-3 w-3" />
                                Pending
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {assignment.score !== null ? `${assignment.score}%` : '-'}
                          </TableCell>
                          <TableCell>
                            {assignment.certificate_url ? (
                              <Button variant="ghost" size="sm" asChild>
                                <a
                                  href={assignment.certificate_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Download className="h-4 w-4" />
                                </a>
                              </Button>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vaccination">
          <Card>
            <CardHeader>
              <CardTitle>Hepatitis B Vaccination</CardTitle>
              <CardDescription>
                Required vaccination status and documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hepBRecord ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Status</p>
                      <p className="text-sm text-muted-foreground">
                        {hepBRecord.status === 'vaccinated'
                          ? 'Fully vaccinated'
                          : hepBRecord.status === 'declined'
                          ? 'Declined vaccination'
                          : hepBRecord.status === 'in_progress'
                          ? 'Vaccination in progress'
                          : 'Not started'}
                      </p>
                    </div>
                    <Badge
                      variant={
                        hepBRecord.status === 'vaccinated'
                          ? 'success'
                          : hepBRecord.status === 'declined'
                          ? 'warning'
                          : 'secondary'
                      }
                    >
                      {hepBRecord.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  {hepBRecord.dose_dates && hepBRecord.dose_dates.length > 0 && (
                    <div>
                      <p className="font-medium mb-2">Dose History</p>
                      <ul className="space-y-1">
                        {hepBRecord.dose_dates.map((date: string, i: number) => (
                          <li key={i} className="text-sm">
                            Dose {i + 1}: {formatDate(date)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {hepBRecord.declination_signed_at && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="font-medium text-yellow-800">
                        Declination Signed
                      </p>
                      <p className="text-sm text-yellow-700">
                        {formatDate(hepBRecord.declination_signed_at)}
                      </p>
                      {hepBRecord.declination_reason && (
                        <p className="text-sm text-yellow-700 mt-1">
                          Reason: {hepBRecord.declination_reason}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No vaccination record found
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Training History</CardTitle>
              <CardDescription>
                Complete history of training completions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainingAssignments
                  .filter((a: any) => a.status === 'completed')
                  .map((assignment: any) => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {assignment.training_modules?.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Completed {formatRelativeDate(assignment.completed_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{assignment.score}%</p>
                        {assignment.certificate_url && (
                          <Button variant="link" size="sm" asChild>
                            <a
                              href={assignment.certificate_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Certificate
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                {trainingAssignments.filter((a: any) => a.status === 'completed')
                  .length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No completed training yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AssignTrainingDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        preselectedUserId={id}
        onSuccess={() => refetch()}
      />
    </div>
  )
}
