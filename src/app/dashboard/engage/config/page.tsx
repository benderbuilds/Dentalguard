'use client'

import { useState, useEffect, useMemo, useCallback, KeyboardEvent } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { trpc } from '@/lib/trpc/client'
import { cn } from '@/lib/utils'
import {
  MessageCircle,
  Palette,
  Building2,
  HelpCircle,
  Code2,
  X,
  Plus,
  Trash2,
  Copy,
  Check,
  Loader2,
  Send,
} from 'lucide-react'

// ── Constants ──────────────────────────────────────────────

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const

const TIME_OPTIONS: string[] = []
for (let h = 6; h <= 21; h++) {
  for (const m of ['00', '30']) {
    if (h === 21 && m === '30') continue
    const hour = h > 12 ? h - 12 : h === 0 ? 12 : h
    const ampm = h >= 12 ? 'PM' : 'AM'
    TIME_OPTIONS.push(`${hour}:${m} ${ampm}`)
  }
}

const DEFAULT_HOURS: Record<string, { open: string; close: string; closed: boolean }> = {
  Monday: { open: '8:00 AM', close: '5:00 PM', closed: false },
  Tuesday: { open: '8:00 AM', close: '5:00 PM', closed: false },
  Wednesday: { open: '8:00 AM', close: '5:00 PM', closed: false },
  Thursday: { open: '8:00 AM', close: '5:00 PM', closed: false },
  Friday: { open: '8:00 AM', close: '5:00 PM', closed: false },
  Saturday: { open: '9:00 AM', close: '1:00 PM', closed: true },
  Sunday: { open: '9:00 AM', close: '1:00 PM', closed: true },
}

// ── Types ──────────────────────────────────────────────────

interface OfficeHoursEntry {
  open: string
  close: string
  closed: boolean
}

interface Provider {
  name: string
  specialty: string
}

interface FAQ {
  question: string
  answer: string
}

interface FormState {
  bot_name: string
  welcome_message: string
  primary_color: string
  logo_url: string
  office_hours: Record<string, OfficeHoursEntry>
  accepted_insurance: string[]
  services: string[]
  providers: Provider[]
  faqs: FAQ[]
  system_prompt_additions: string
}

// ── Component ──────────────────────────────────────────────

export default function ChatbotConfigPage() {
  const { toast } = useToast()
  const { data: config, isLoading } = trpc.engage.getChatbotConfig.useQuery()
  const { data: embedData } = trpc.engage.getEmbedCode.useQuery()
  const utils = trpc.useUtils()

  const updateConfig = trpc.engage.updateChatbotConfig.useMutation({
    onSuccess: () => {
      utils.engage.getChatbotConfig.invalidate()
      utils.engage.getEmbedCode.invalidate()
      toast({ title: 'Configuration saved', description: 'Your chatbot settings have been updated.' })
    },
    onError: (error) => {
      toast({ title: 'Error saving configuration', description: error.message, variant: 'destructive' })
    },
  })

  const [form, setForm] = useState<FormState | null>(null)
  const [insuranceInput, setInsuranceInput] = useState('')
  const [servicesInput, setServicesInput] = useState('')
  const [copied, setCopied] = useState(false)

  // Initialize form from config
  useEffect(() => {
    if (config && !form) {
      const configHours = config.office_hours as Record<string, { open: string; close: string }> | null
      const hours: Record<string, OfficeHoursEntry> = {}
      for (const day of DAYS) {
        if (configHours && configHours[day]) {
          hours[day] = { ...configHours[day], closed: false }
        } else {
          hours[day] = { ...DEFAULT_HOURS[day] }
        }
      }

      setForm({
        bot_name: config.bot_name ?? 'Practice Assistant',
        welcome_message: config.welcome_message ?? 'Hi! How can I help you today?',
        primary_color: config.primary_color ?? '#2563eb',
        logo_url: (config.logo_url as string) ?? '',
        office_hours: hours,
        accepted_insurance: Array.isArray(config.accepted_insurance) ? (config.accepted_insurance as string[]) : [],
        services: Array.isArray(config.services) ? (config.services as string[]) : [],
        providers: Array.isArray(config.providers_display)
          ? (config.providers_display as { name: string; specialty?: string }[]).map((p) => ({
              name: p.name,
              specialty: p.specialty ?? '',
            }))
          : [],
        faqs: Array.isArray(config.custom_faqs)
          ? (config.custom_faqs as { question: string; answer: string }[])
          : [],
        system_prompt_additions: config.system_prompt_additions ?? '',
      })
    }
  }, [config, form])

  // Default form for new configs (no data yet)
  const defaultForm = useMemo<FormState>(() => ({
    bot_name: 'Practice Assistant',
    welcome_message: 'Hi! How can I help you today?',
    primary_color: '#2563eb',
    logo_url: '',
    office_hours: { ...DEFAULT_HOURS },
    accepted_insurance: [],
    services: [],
    providers: [],
    faqs: [],
    system_prompt_additions: '',
  }), [])

  const f: FormState = form ?? defaultForm

  const updateForm = useCallback(
    (patch: Partial<FormState>) => {
      setForm((prev) => ({ ...(prev ?? defaultForm), ...patch }))
    },
    [defaultForm]
  )

  const handleSave = () => {
    // Build office_hours without the `closed` flag for the DB
    const officeHours: Record<string, { open: string; close: string }> = {}
    for (const day of DAYS) {
      if (!f.office_hours[day]?.closed) {
        officeHours[day] = {
          open: f.office_hours[day]?.open ?? '8:00 AM',
          close: f.office_hours[day]?.close ?? '5:00 PM',
        }
      }
    }

    updateConfig.mutate({
      bot_name: f.bot_name,
      welcome_message: f.welcome_message,
      primary_color: f.primary_color,
      logo_url: f.logo_url || null,
      office_hours: officeHours,
      accepted_insurance: f.accepted_insurance,
      services: f.services,
      providers_display: f.providers.filter((p) => p.name.trim()),
      custom_faqs: f.faqs.filter((fq) => fq.question.trim() && fq.answer.trim()),
      system_prompt_additions: f.system_prompt_additions || null,
      is_active: true,
    })
  }

  // Tag input handlers
  const handleTagKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    value: string,
    setValue: (v: string) => void,
    list: string[],
    field: 'accepted_insurance' | 'services'
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const tag = value.trim()
      if (tag && !list.includes(tag)) {
        updateForm({ [field]: [...list, tag] })
      }
      setValue('')
    }
  }

  const removeTag = (field: 'accepted_insurance' | 'services', index: number) => {
    updateForm({ [field]: f[field].filter((_, i) => i !== index) })
  }

  // Copy embed code
  const handleCopy = async () => {
    if (!embedData?.scriptTag) return
    await navigator.clipboard.writeText(embedData.scriptTag)
    setCopied(true)
    toast({ title: 'Copied', description: 'Embed code copied to clipboard.' })
    setTimeout(() => setCopied(false), 2000)
  }

  // ── Loading State ──────────────────────────────────────

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-64 bg-muted rounded animate-pulse" />
          <div className="h-4 w-96 bg-muted rounded animate-pulse mt-2" />
        </div>
        <div className="h-[500px] bg-muted/50 rounded-lg animate-pulse" />
      </div>
    )
  }

  // ── Render ─────────────────────────────────────────────

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Chatbot Configuration</h1>
        <p className="text-muted-foreground mt-1">
          Customize your AI chatbot&apos;s appearance, knowledge, and behavior
        </p>
      </div>

      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="branding" className="gap-1.5">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Branding</span>
          </TabsTrigger>
          <TabsTrigger value="practice" className="gap-1.5">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Practice Info</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="gap-1.5">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQs</span>
          </TabsTrigger>
          <TabsTrigger value="embed" className="gap-1.5">
            <Code2 className="h-4 w-4" />
            <span className="hidden sm:inline">Embed Code</span>
          </TabsTrigger>
        </TabsList>

        {/* ─── Branding Tab ─────────────────────────────── */}
        <TabsContent value="branding">
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <Card>
              <CardHeader>
                <CardTitle>Widget Appearance</CardTitle>
                <CardDescription>
                  Customize how the chatbot looks on your website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="bot_name">Bot Name</Label>
                  <Input
                    id="bot_name"
                    value={f.bot_name}
                    onChange={(e) => updateForm({ bot_name: e.target.value })}
                    placeholder="e.g., Sarah, Practice Assistant"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="welcome_message">Welcome Message</Label>
                  <Textarea
                    id="welcome_message"
                    value={f.welcome_message}
                    onChange={(e) => updateForm({ welcome_message: e.target.value })}
                    placeholder="Hi! How can I help you today?"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primary_color">Brand Color</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      id="primary_color"
                      value={f.primary_color}
                      onChange={(e) => updateForm({ primary_color: e.target.value })}
                      className="h-10 w-14 rounded border border-input cursor-pointer"
                    />
                    <Input
                      value={f.primary_color}
                      onChange={(e) => updateForm({ primary_color: e.target.value })}
                      placeholder="#2563eb"
                      className="w-32 font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo_url">Logo URL</Label>
                  <Input
                    id="logo_url"
                    value={f.logo_url}
                    onChange={(e) => updateForm({ logo_url: e.target.value })}
                    placeholder="https://example.com/logo.png"
                  />
                  {f.logo_url && (
                    <div className="mt-2 flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg border border-input bg-muted/50 flex items-center justify-center overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={f.logo_url}
                          alt="Logo preview"
                          className="h-full w-full object-contain"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">Logo preview</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Live Preview */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Live Preview
              </Label>
              <div className="rounded-xl border bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 p-6 min-h-[420px] flex flex-col items-end justify-end relative">
                {/* Chat Window Preview */}
                <div className="w-full max-w-[320px] rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900">
                  {/* Header */}
                  <div
                    className="px-4 py-3 flex items-center gap-3"
                    style={{ backgroundColor: f.primary_color }}
                  >
                    {f.logo_url ? (
                      <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={f.logo_url}
                          alt=""
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const el = e.target as HTMLImageElement
                            el.style.display = 'none'
                            el.parentElement!.innerHTML =
                              '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/><circle cx="9" cy="9" r="3"/><rect width="20" height="20" x="2" y="2" rx="2"/></svg>'
                          }}
                        />
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                        <MessageCircle className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="text-white font-semibold text-sm leading-tight">
                        {f.bot_name || 'Practice Assistant'}
                      </p>
                      <p className="text-white/70 text-xs">Online</p>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="p-4 space-y-3 min-h-[180px] bg-slate-50 dark:bg-slate-950">
                    <div className="flex gap-2">
                      <div
                        className="h-6 w-6 rounded-full shrink-0 flex items-center justify-center mt-0.5"
                        style={{ backgroundColor: f.primary_color }}
                      >
                        <MessageCircle className="h-3 w-3 text-white" />
                      </div>
                      <div className="bg-white dark:bg-slate-800 rounded-xl rounded-tl-sm px-3 py-2 shadow-sm border border-slate-100 dark:border-slate-700 max-w-[85%]">
                        <p className="text-sm text-slate-700 dark:text-slate-200">
                          {f.welcome_message || 'Hi! How can I help you today?'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Input Area */}
                  <div className="px-3 py-2 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2 bg-white dark:bg-slate-900">
                    <div className="flex-1 h-9 rounded-full bg-slate-100 dark:bg-slate-800 px-4 flex items-center">
                      <span className="text-xs text-slate-400">Type a message...</span>
                    </div>
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: f.primary_color }}
                    >
                      <Send className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Floating Bubble */}
                <div
                  className="mt-4 h-14 w-14 rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                  style={{ backgroundColor: f.primary_color }}
                >
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ─── Practice Info Tab ─────────────────────────── */}
        <TabsContent value="practice">
          <div className="space-y-6">
            {/* Office Hours */}
            <Card>
              <CardHeader>
                <CardTitle>Office Hours</CardTitle>
                <CardDescription>
                  Set your practice hours so the chatbot can inform patients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {DAYS.map((day) => {
                    const entry = f.office_hours[day] ?? DEFAULT_HOURS[day]
                    return (
                      <div
                        key={day}
                        className={cn(
                          'grid grid-cols-[100px_1fr_1fr_auto] gap-3 items-center py-2 px-3 rounded-lg',
                          entry.closed ? 'bg-muted/50' : 'bg-transparent'
                        )}
                      >
                        <span className="text-sm font-medium">{day.slice(0, 3)}</span>

                        <Select
                          value={entry.open}
                          disabled={entry.closed}
                          onValueChange={(val) =>
                            updateForm({
                              office_hours: {
                                ...f.office_hours,
                                [day]: { ...entry, open: val },
                              },
                            })
                          }
                        >
                          <SelectTrigger className={cn('h-9', entry.closed && 'opacity-50')}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TIME_OPTIONS.map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={entry.close}
                          disabled={entry.closed}
                          onValueChange={(val) =>
                            updateForm({
                              office_hours: {
                                ...f.office_hours,
                                [day]: { ...entry, close: val },
                              },
                            })
                          }
                        >
                          <SelectTrigger className={cn('h-9', entry.closed && 'opacity-50')}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TIME_OPTIONS.map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <Checkbox
                            checked={entry.closed}
                            onCheckedChange={(checked) =>
                              updateForm({
                                office_hours: {
                                  ...f.office_hours,
                                  [day]: { ...entry, closed: !!checked },
                                },
                              })
                            }
                          />
                          <span className="text-sm text-muted-foreground">Closed</span>
                        </label>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Insurance & Services */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Accepted Insurance</CardTitle>
                  <CardDescription>
                    Type a name and press Enter to add
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    value={insuranceInput}
                    onChange={(e) => setInsuranceInput(e.target.value)}
                    onKeyDown={(e) =>
                      handleTagKeyDown(e, insuranceInput, setInsuranceInput, f.accepted_insurance, 'accepted_insurance')
                    }
                    placeholder="e.g., Delta Dental"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {f.accepted_insurance.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="gap-1 pr-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag('accepted_insurance', i)}
                          className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {f.accepted_insurance.length === 0 && (
                      <p className="text-xs text-muted-foreground">No insurance plans added yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Services Offered</CardTitle>
                  <CardDescription>
                    Type a service and press Enter to add
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    value={servicesInput}
                    onChange={(e) => setServicesInput(e.target.value)}
                    onKeyDown={(e) =>
                      handleTagKeyDown(e, servicesInput, setServicesInput, f.services, 'services')
                    }
                    placeholder="e.g., Cosmetic Dentistry"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {f.services.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="gap-1 pr-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag('services', i)}
                          className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {f.services.length === 0 && (
                      <p className="text-xs text-muted-foreground">No services added yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Providers */}
            <Card>
              <CardHeader>
                <CardTitle>Providers</CardTitle>
                <CardDescription>
                  List the dentists and specialists at your practice
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {f.providers.length === 0 && (
                  <p className="text-sm text-muted-foreground py-2">
                    No providers added yet. Click below to add one.
                  </p>
                )}
                {f.providers.map((provider, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Input
                      value={provider.name}
                      onChange={(e) => {
                        const updated = [...f.providers]
                        updated[i] = { ...updated[i], name: e.target.value }
                        updateForm({ providers: updated })
                      }}
                      placeholder="Provider name"
                      className="flex-1"
                    />
                    <Input
                      value={provider.specialty}
                      onChange={(e) => {
                        const updated = [...f.providers]
                        updated[i] = { ...updated[i], specialty: e.target.value }
                        updateForm({ providers: updated })
                      }}
                      placeholder="Specialty"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        updateForm({ providers: f.providers.filter((_, idx) => idx !== i) })
                      }}
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateForm({ providers: [...f.providers, { name: '', specialty: '' }] })
                  }
                  className="gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  Add Provider
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ─── FAQ Tab ──────────────────────────────────── */}
        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>Custom FAQs</CardTitle>
              <CardDescription>
                Add common questions and answers to help the chatbot respond accurately
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {f.faqs.length === 0 && (
                <div className="text-center py-8">
                  <HelpCircle className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No FAQs yet. Add common questions your patients ask so the chatbot can answer them.
                  </p>
                </div>
              )}
              {f.faqs.map((faq, i) => (
                <div key={i} className="relative rounded-lg border p-4 space-y-3 bg-muted/30">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Question
                        </Label>
                        <Input
                          value={faq.question}
                          onChange={(e) => {
                            const updated = [...f.faqs]
                            updated[i] = { ...updated[i], question: e.target.value }
                            updateForm({ faqs: updated })
                          }}
                          placeholder="e.g., Do you offer payment plans?"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Answer
                        </Label>
                        <Textarea
                          value={faq.answer}
                          onChange={(e) => {
                            const updated = [...f.faqs]
                            updated[i] = { ...updated[i], answer: e.target.value }
                            updateForm({ faqs: updated })
                          }}
                          placeholder="Yes, we offer flexible payment plans..."
                          rows={2}
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        updateForm({ faqs: f.faqs.filter((_, idx) => idx !== i) })
                      }}
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  updateForm({ faqs: [...f.faqs, { question: '', answer: '' }] })
                }
                className="gap-1.5"
              >
                <Plus className="h-4 w-4" />
                Add FAQ
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Embed Code Tab ───────────────────────────── */}
        <TabsContent value="embed">
          <Card>
            <CardHeader>
              <CardTitle>Embed Code</CardTitle>
              <CardDescription>
                Add this code to your website to display the chatbot widget
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {embedData?.scriptTag ? (
                <>
                  <div className="relative">
                    <pre className="rounded-lg bg-slate-950 text-slate-50 p-4 text-sm font-mono overflow-x-auto">
                      <code>{embedData.scriptTag}</code>
                    </pre>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleCopy}
                      className="absolute top-3 right-3 gap-1.5"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                    <h4 className="text-sm font-semibold">Installation Instructions</h4>
                    <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                      <li>
                        Copy the embed code above
                      </li>
                      <li>
                        Paste it into your website&apos;s HTML, just before the closing{' '}
                        <code className="text-xs bg-muted px-1 py-0.5 rounded font-mono">&lt;/body&gt;</code> tag
                      </li>
                      <li>
                        The chatbot widget will appear automatically on your website
                      </li>
                    </ol>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Code2 className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Your embed code will be available after saving your chatbot configuration.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ─── Save Button ──────────────────────────────── */}
      <div className="flex items-center gap-3 pt-2 border-t">
        <Button onClick={handleSave} disabled={updateConfig.isPending} className="gap-2">
          {updateConfig.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {updateConfig.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
        <p className="text-xs text-muted-foreground">
          Changes apply to all tabs
        </p>
      </div>
    </div>
  )
}
