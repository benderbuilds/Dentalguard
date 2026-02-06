'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { trpc } from '@/lib/trpc/client'

export default function ChatbotConfigPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { data: config, isLoading } = trpc.engage.getChatbotConfig.useQuery()
  const utils = trpc.useUtils()

  const updateConfig = trpc.engage.updateChatbotConfig.useMutation({
    onSuccess: () => {
      utils.engage.getChatbotConfig.invalidate()
      toast({ title: 'Configuration saved', description: 'Your chatbot settings have been updated.' })
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  const [formData, setFormData] = useState<{
    bot_name: string
    welcome_message: string
    primary_color: string
    accepted_insurance: string
    services: string
    system_prompt_additions: string
  } | null>(null)

  // Initialize form data when config loads
  const form = formData ?? {
    bot_name: config?.bot_name ?? 'Practice Assistant',
    welcome_message: config?.welcome_message ?? 'Hi! How can I help you today?',
    primary_color: config?.primary_color ?? '#2563eb',
    accepted_insurance: Array.isArray(config?.accepted_insurance)
      ? (config.accepted_insurance as string[]).join(', ')
      : '',
    services: Array.isArray(config?.services)
      ? (config.services as string[]).join(', ')
      : '',
    system_prompt_additions: config?.system_prompt_additions ?? '',
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateConfig.mutate({
      bot_name: form.bot_name,
      welcome_message: form.welcome_message,
      primary_color: form.primary_color,
      accepted_insurance: form.accepted_insurance
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      services: form.services
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      system_prompt_additions: form.system_prompt_additions || null,
      is_active: true,
    })
  }

  const updateField = (field: string, value: string) => {
    setFormData({ ...form, [field]: value })
  }

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading configuration...</div>
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Chatbot Configuration</h1>
        <p className="text-muted-foreground">Configure your AI chatbot appearance and behavior</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the chatbot looks on your website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bot_name">Bot Name</Label>
              <Input
                id="bot_name"
                value={form.bot_name}
                onChange={(e) => updateField('bot_name', e.target.value)}
                placeholder="e.g., Sarah, Practice Assistant"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="welcome_message">Welcome Message</Label>
              <Textarea
                id="welcome_message"
                value={form.welcome_message}
                onChange={(e) => updateField('welcome_message', e.target.value)}
                placeholder="Hi! How can I help you today?"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primary_color">Brand Color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="primary_color"
                  value={form.primary_color}
                  onChange={(e) => updateField('primary_color', e.target.value)}
                  className="h-10 w-14 rounded border cursor-pointer"
                />
                <Input
                  value={form.primary_color}
                  onChange={(e) => updateField('primary_color', e.target.value)}
                  placeholder="#2563eb"
                  className="w-32"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Practice Information</CardTitle>
            <CardDescription>Help the chatbot answer questions about your practice</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accepted_insurance">Accepted Insurance (comma-separated)</Label>
              <Textarea
                id="accepted_insurance"
                value={form.accepted_insurance}
                onChange={(e) => updateField('accepted_insurance', e.target.value)}
                placeholder="Delta Dental, Cigna, MetLife, Aetna"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="services">Services Offered (comma-separated)</Label>
              <Textarea
                id="services"
                value={form.services}
                onChange={(e) => updateField('services', e.target.value)}
                placeholder="General Dentistry, Cosmetic Dentistry, Orthodontics, Implants"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="system_prompt_additions">Custom Instructions (optional)</Label>
              <Textarea
                id="system_prompt_additions"
                value={form.system_prompt_additions}
                onChange={(e) => updateField('system_prompt_additions', e.target.value)}
                placeholder="Any special instructions for the chatbot..."
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Add custom instructions to guide the chatbot behavior specific to your practice.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={updateConfig.isPending}>
            {updateConfig.isPending ? 'Saving...' : 'Save Configuration'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
