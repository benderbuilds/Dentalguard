'use client'

import { useState } from 'react'
import Link from 'next/link'
import { trpc } from '@/lib/trpc/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Plus,
  Search,
  MoreVertical,
  Mail,
  Eye,
  UserMinus,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

function getTrainingStatusIcon(status: string, dueDate: string) {
  const now = new Date()
  const due = new Date(dueDate)

  if (status === 'completed') {
    return <CheckCircle className="h-4 w-4 text-green-600" />
  }

  if (due < now) {
    return <XCircle className="h-4 w-4 text-red-600" />
  }

  const daysUntilDue = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (daysUntilDue <= 30) {
    return <AlertTriangle className="h-4 w-4 text-yellow-600" />
  }

  return <Clock className="h-4 w-4 text-gray-400" />
}

function getVaccinationIcon(status: string | undefined) {
  if (!status || status === 'not_started') {
    return <Clock className="h-4 w-4 text-gray-400" />
  }
  if (status === 'vaccinated') {
    return <CheckCircle className="h-4 w-4 text-green-600" />
  }
  if (status === 'declined') {
    return <XCircle className="h-4 w-4 text-yellow-600" />
  }
  return <Clock className="h-4 w-4 text-blue-600" />
}

export default function EmployeesPage() {
  const [search, setSearch] = useState('')
  const [showInactive, setShowInactive] = useState(false)

  const { data: employees, isLoading, refetch } = trpc.employees.list.useQuery({
    includeInactive: showInactive,
  })

  const sendReminder = trpc.employees.sendReminder.useMutation({
    onSuccess: () => {
      // Show success toast
    },
  })

  const filteredEmployees = employees?.filter((employee) =>
    employee.name.toLowerCase().includes(search.toLowerCase()) ||
    employee.email.toLowerCase().includes(search.toLowerCase())
  )

  // Get training status summary for each employee
  function getEmployeeTrainingStatus(employee: any) {
    const assignments = employee.training_assignments || []
    const now = new Date()

    const overdue = assignments.filter(
      (a: any) => a.status !== 'completed' && new Date(a.due_date) < now
    ).length

    const dueSoon = assignments.filter((a: any) => {
      if (a.status === 'completed') return false
      const due = new Date(a.due_date)
      const daysUntil = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return daysUntil > 0 && daysUntil <= 30
    }).length

    const completed = assignments.filter((a: any) => a.status === 'completed').length

    return { overdue, dueSoon, completed, total: assignments.length }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Employees</h1>
          <p className="text-muted-foreground">
            Manage your team and their compliance status
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/employees/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="showInactive"
                checked={showInactive}
                onCheckedChange={(checked) => setShowInactive(checked === true)}
              />
              <label
                htmlFor="showInactive"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Show inactive
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Grid */}
      <Card>
        <CardHeader>
          <CardTitle>All Employees</CardTitle>
          <CardDescription>
            {filteredEmployees?.length || 0} employees
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading employees...
            </div>
          ) : filteredEmployees?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No employees found</p>
              <Button asChild>
                <Link href="/dashboard/employees/new">Add your first employee</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Hire Date</TableHead>
                  <TableHead className="text-center">BBP</TableHead>
                  <TableHead className="text-center">HIPAA</TableHead>
                  <TableHead className="text-center">HazCom</TableHead>
                  <TableHead className="text-center">Hep B</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees?.map((employee) => {
                  const trainingStatus = getEmployeeTrainingStatus(employee)
                  const hepBRecord = employee.vaccination_records?.find(
                    (v: any) => v.vaccine_type === 'hep_b'
                  )

                  // Find specific training modules
                  const bbpTraining = employee.training_assignments?.find(
                    (a: any) => a.training_modules?.type === 'osha'
                  )
                  const hipaaTraining = employee.training_assignments?.find(
                    (a: any) => a.training_modules?.type === 'hipaa'
                  )
                  const hazcomTraining = employee.training_assignments?.find(
                    (a: any) => a.training_modules?.type === 'hazcom'
                  )

                  return (
                    <TableRow
                      key={employee.id}
                      className={employee.status === 'inactive' ? 'opacity-50' : ''}
                    >
                      <TableCell>
                        <Link
                          href={`/dashboard/employees/${employee.id}`}
                          className="font-medium hover:underline"
                        >
                          {employee.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {employee.email}
                        </p>
                      </TableCell>
                      <TableCell className="capitalize">{employee.role}</TableCell>
                      <TableCell>
                        {employee.hire_date
                          ? formatDate(employee.hire_date)
                          : '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        {bbpTraining ? (
                          getTrainingStatusIcon(bbpTraining.status, bbpTraining.due_date)
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {hipaaTraining ? (
                          getTrainingStatusIcon(hipaaTraining.status, hipaaTraining.due_date)
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {hazcomTraining ? (
                          getTrainingStatusIcon(hazcomTraining.status, hazcomTraining.due_date)
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {getVaccinationIcon(hepBRecord?.status)}
                      </TableCell>
                      <TableCell>
                        {trainingStatus.overdue > 0 ? (
                          <Badge variant="error">
                            {trainingStatus.overdue} overdue
                          </Badge>
                        ) : trainingStatus.dueSoon > 0 ? (
                          <Badge variant="warning">
                            {trainingStatus.dueSoon} due soon
                          </Badge>
                        ) : (
                          <Badge variant="success">Compliant</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/employees/${employee.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                sendReminder.mutate({ userId: employee.id })
                              }
                            >
                              <Mail className="mr-2 h-4 w-4" />
                              Send reminder
                            </DropdownMenuItem>
                            {employee.status === 'active' && (
                              <DropdownMenuItem className="text-red-600">
                                <UserMinus className="mr-2 h-4 w-4" />
                                Deactivate
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span>Due within 30 days</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <span>Overdue</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>Not started / Pending</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
