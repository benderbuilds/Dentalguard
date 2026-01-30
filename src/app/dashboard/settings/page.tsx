'use client'

import { useState } from 'react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import {
  Building2,
  CreditCard,
  Users,
  Bell,
  Shield,
} from 'lucide-react'
import { US_STATES, PLAN_PRICING } from '@/lib/utils'

const practiceSchema = z.object({
  name: z.string().min(1),
  addressLine1: z.string().optional(),
  city: z.string().optional(),
  state: z.string().length(2),
  zipCode: z.string().optional(),
  phone: z.string().optional(),
})

const organizationSchema = z.object({
  name: z.string().min(1),
  billingEmail: z.string().email(),
})

export default function SettingsPage() {
  const { toast } = useToast()

  const { data: organization } = trpc.organizations.getCurrent.useQuery()
  const { data: practice } = trpc.practices.getCurrent.useQuery()
  const { data: subscription } = trpc.organizations.getSubscription.useQuery()

  const updatePractice = trpc.practices.update.useMutation({
    onSuccess: () => {
      toast({
        title: 'Settings saved',
        description: 'Your practice settings have been updated.',
      })
    },
  })

  const updateOrganization = trpc.organizations.update.useMutation({
    onSuccess: () => {
      toast({
        title: 'Settings saved',
        description: 'Your organization settings have been updated.',
      })
    },
  })

  const practiceForm = useForm({
    resolver: zodResolver(practiceSchema),
    values: {
      name: practice?.name || '',
      addressLine1: practice?.address_line1 || '',
      city: practice?.city || '',
      state: practice?.state || '',
      zipCode: practice?.zip_code || '',
      phone: practice?.phone || '',
    },
  })

  const organizationForm = useForm({
    resolver: zodResolver(organizationSchema),
    values: {
      name: organization?.name || '',
      billingEmail: organization?.billing_email || '',
    },
  })

  function handlePracticeSubmit(data: z.infer<typeof practiceSchema>) {
    if (!practice?.id) return
    updatePractice.mutate({ id: practice.id, ...data })
  }

  function handleOrganizationSubmit(data: z.infer<typeof organizationSchema>) {
    updateOrganization.mutate(data)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your practice and organization settings
        </p>
      </div>

      <Tabs defaultValue="practice" className="space-y-6">
        <TabsList>
          <TabsTrigger value="practice" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Practice
          </TabsTrigger>
          <TabsTrigger value="organization" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Organization
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Practice Settings */}
        <TabsContent value="practice">
          <Card>
            <CardHeader>
              <CardTitle>Practice Information</CardTitle>
              <CardDescription>
                Update your practice details and location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...practiceForm}>
                <form
                  onSubmit={practiceForm.handleSubmit(handlePracticeSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={practiceForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Practice Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          <Input {...field} />
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
                            <Input {...field} />
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
                                <SelectValue />
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
                            State-specific requirements will be applied
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
                            <Input {...field} />
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
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" disabled={updatePractice.isPending}>
                    {updatePractice.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Organization Settings */}
        <TabsContent value="organization">
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>
                Manage your organization settings (for DSOs with multiple practices)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...organizationForm}>
                <form
                  onSubmit={organizationForm.handleSubmit(handleOrganizationSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={organizationForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={organizationForm.control}
                    name="billingEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Billing Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormDescription>
                          Invoices and billing updates will be sent here
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={updateOrganization.isPending}>
                    {updateOrganization.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing">
          <div className="space-y-6">
            {/* Current Plan */}
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>
                  Your subscription and billing information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium capitalize">
                        {subscription?.plan_type || 'Solo'} Plan
                      </p>
                      {subscription?.isTrialing && (
                        <Badge variant="secondary">Trial</Badge>
                      )}
                    </div>
                    {subscription?.isTrialing && (
                      <p className="text-sm text-muted-foreground">
                        {subscription.trialDaysRemaining} days remaining in trial
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      ${PLAN_PRICING[subscription?.plan_type as keyof typeof PLAN_PRICING]?.monthly || 99}
                      <span className="text-sm font-normal text-muted-foreground">
                        /mo
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline">Change Plan</Button>
                  <Button variant="outline">Update Payment Method</Button>
                </div>
              </CardContent>
            </Card>

            {/* Billing History */}
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>
                  View and download past invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  No billing history yet
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  title: 'Training Reminders',
                  description: 'Remind employees about upcoming training deadlines',
                  enabled: true,
                },
                {
                  title: 'Overdue Alerts',
                  description: 'Notify admins when training becomes overdue',
                  enabled: true,
                },
                {
                  title: 'New Hire Onboarding',
                  description: 'Send welcome emails to new employees',
                  enabled: true,
                },
                {
                  title: 'Document Review Reminders',
                  description: 'Remind when ECP annual review is due',
                  enabled: true,
                },
                {
                  title: 'Compliance Reports',
                  description: 'Weekly compliance summary emails',
                  enabled: false,
                },
              ].map((notification) => (
                <div
                  key={notification.title}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {notification.description}
                    </p>
                  </div>
                  <Button
                    variant={notification.enabled ? 'default' : 'outline'}
                    size="sm"
                  >
                    {notification.enabled ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
