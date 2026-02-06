'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { trpc } from '@/lib/trpc/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/components/ui/use-toast'
import {
  Building2,
  Users,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Shield,
} from 'lucide-react'
import { US_STATES } from '@/lib/utils'

const practiceSchema = z.object({
  name: z.string().min(1, 'Practice name is required'),
  addressLine1: z.string().optional(),
  city: z.string().optional(),
  state: z.string().length(2, 'Select a state'),
  zipCode: z.string().optional(),
  phone: z.string().optional(),
})

const employeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  role: z.enum(['admin', 'manager', 'employee']),
  jobTitle: z.string().optional(),
  hireDate: z.string().optional(),
})

type PracticeFormValues = z.infer<typeof practiceSchema>
type EmployeeFormValues = z.infer<typeof employeeSchema>

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [practiceId, setPracticeId] = useState<string | null>(null)
  const [employees, setEmployees] = useState<EmployeeFormValues[]>([])
  const [currentEmployee, setCurrentEmployee] = useState<EmployeeFormValues>({
    name: '',
    email: '',
    role: 'employee',
    jobTitle: '',
    hireDate: new Date().toISOString().split('T')[0],
  })

  const router = useRouter()
  const { toast } = useToast()

  const totalSteps = 3
  const progressPercent = (step / totalSteps) * 100

  const createPractice = trpc.practices.create.useMutation({
    onSuccess: (data) => {
      setPracticeId(data.id)
      setStep(2)
      toast({
        title: 'Practice created',
        description: 'Now let\'s add your team members.',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      })
    },
  })

  const assignSelfToPractice = trpc.practices.assignSelfToPractice.useMutation()
  const createEmployee = trpc.employees.create.useMutation()

  const practiceForm = useForm<PracticeFormValues>({
    resolver: zodResolver(practiceSchema),
    defaultValues: {
      name: '',
      addressLine1: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
    },
  })

  async function handlePracticeSubmit(data: PracticeFormValues) {
    createPractice.mutate(data)
  }

  function addEmployee() {
    const result = employeeSchema.safeParse(currentEmployee)
    if (!result.success) {
      toast({
        variant: 'destructive',
        title: 'Invalid employee',
        description: 'Please fill in all required fields.',
      })
      return
    }

    setEmployees([...employees, currentEmployee])
    setCurrentEmployee({
      name: '',
      email: '',
      role: 'employee',
      jobTitle: '',
      hireDate: new Date().toISOString().split('T')[0],
    })
  }

  function removeEmployee(index: number) {
    setEmployees(employees.filter((_, i) => i !== index))
  }

  async function handleComplete() {
    if (!practiceId) return

    toast({
      title: 'Setting up your practice...',
      description: 'Adding employees and assigning training.',
    })

    // Assign the admin user to this practice so auto_assign_training triggers
    try {
      await assignSelfToPractice.mutateAsync({ practiceId })
    } catch (error) {
      console.error('Error assigning self to practice:', error)
    }

    // Create all employees
    for (const emp of employees) {
      try {
        await createEmployee.mutateAsync({
          ...emp,
          practiceId,
          hireDate: emp.hireDate || undefined,
          jobTitle: emp.jobTitle || undefined,
        })
      } catch (error) {
        console.error('Error creating employee:', error)
      }
    }

    toast({
      title: 'Setup complete!',
      description: 'Your practice is ready. Redirecting to dashboard...',
    })

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">DentalPilot</span>
          </div>
          <h1 className="text-2xl font-bold">Set Up Your Practice</h1>
          <p className="text-muted-foreground">
            Let&apos;s get you started in just a few minutes
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round(progressPercent)}% complete</span>
          </div>
          <Progress value={progressPercent} />
          <div className="flex justify-between mt-2">
            <div
              className={`flex items-center gap-1 text-xs ${
                step >= 1 ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Building2 className="h-4 w-4" />
              Practice
            </div>
            <div
              className={`flex items-center gap-1 text-xs ${
                step >= 2 ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Users className="h-4 w-4" />
              Team
            </div>
            <div
              className={`flex items-center gap-1 text-xs ${
                step >= 3 ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <CheckCircle className="h-4 w-4" />
              Complete
            </div>
          </div>
        </div>

        {/* Step 1: Practice Info */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Practice Information
              </CardTitle>
              <CardDescription>
                Tell us about your dental practice
              </CardDescription>
            </CardHeader>
            <Form {...practiceForm}>
              <form onSubmit={practiceForm.handleSubmit(handlePracticeSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={practiceForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Practice Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Smith Family Dentistry" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={practiceForm.control}
                    name="addressLine1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main Street" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={practiceForm.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Los Angeles" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={practiceForm.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {US_STATES.map((state) => (
                                <SelectItem key={state.code} value={state.code}>
                                  {state.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            We&apos;ll include state-specific requirements
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={practiceForm.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP Code</FormLabel>
                          <FormControl>
                            <Input placeholder="90210" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={practiceForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={createPractice.isPending}
                  >
                    {createPractice.isPending ? (
                      'Creating...'
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        )}

        {/* Step 2: Add Employees */}
        {step === 2 && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Add Your Team
                </CardTitle>
                <CardDescription>
                  Add employees who need compliance training. You can add more
                  later.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      placeholder="Jane Smith"
                      value={currentEmployee.name}
                      onChange={(e) =>
                        setCurrentEmployee({
                          ...currentEmployee,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      placeholder="jane@example.com"
                      value={currentEmployee.email}
                      onChange={(e) =>
                        setCurrentEmployee({
                          ...currentEmployee,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Role</label>
                    <Select
                      value={currentEmployee.role}
                      onValueChange={(value: any) =>
                        setCurrentEmployee({ ...currentEmployee, role: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Job Title</label>
                    <Input
                      placeholder="Hygienist"
                      value={currentEmployee.jobTitle}
                      onChange={(e) =>
                        setCurrentEmployee({
                          ...currentEmployee,
                          jobTitle: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Hire Date</label>
                    <Input
                      type="date"
                      value={currentEmployee.hireDate}
                      onChange={(e) =>
                        setCurrentEmployee({
                          ...currentEmployee,
                          hireDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addEmployee}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Employee
                </Button>
              </CardContent>
            </Card>

            {/* Employee List */}
            {employees.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Added Employees ({employees.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {employees.map((emp, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{emp.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {emp.email} · {emp.role}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEmployee(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button className="flex-1" onClick={() => setStep(3)}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Complete */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Review & Complete
              </CardTitle>
              <CardDescription>
                Review your setup before we get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="font-medium mb-2">What happens next:</p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    Training will be automatically assigned based on hire dates
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    Employees will receive email invitations to complete training
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    Automatic reminders will be sent as deadlines approach
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    Your dashboard will track compliance in real-time
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Practice
                  </p>
                  <p className="font-medium">{practiceForm.getValues('name')}</p>
                  <p className="text-sm text-muted-foreground">
                    {practiceForm.getValues('city')},{' '}
                    {practiceForm.getValues('state')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Team Members
                  </p>
                  <p className="font-medium">
                    {employees.length} employee{employees.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={handleComplete}
                disabled={createEmployee.isPending}
              >
                {createEmployee.isPending ? (
                  'Setting up...'
                ) : (
                  <>
                    Complete Setup
                    <CheckCircle className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
