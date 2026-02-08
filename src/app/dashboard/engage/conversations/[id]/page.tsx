'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import {
  ArrowLeft,
  Mail,
  Phone,
  User,
  Calendar,
  Shield,
  Stethoscope,
  Send,
  Loader2,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { trpc } from '@/lib/trpc/client'

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-blue-100 text-blue-800',
  lead: 'bg-yellow-100 text-yellow-800',
  booked: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
  spam: 'bg-red-100 text-red-800',
}

const STATUSES = ['active', 'lead', 'booked', 'closed', 'spam'] as const

type Message = {
  id: string
  role: string
  content: string
  metadata?: Record<string, unknown> | null
  created_at: string
}

export default function ConversationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const id = params.id as string

  const [noteContent, setNoteContent] = useState('')
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [isEditingInfo, setIsEditingInfo] = useState(false)

  const utils = trpc.useUtils()

  const { data: conversation, isLoading } =
    trpc.engage.getConversation.useQuery(
      { id },
      { enabled: !!id }
    )

  useEffect(() => {
    if (conversation && !isEditingInfo) {
      setEditName(conversation.patient_name ?? '')
      setEditEmail(conversation.patient_email ?? '')
      setEditPhone(conversation.patient_phone ?? '')
    }
  }, [conversation, isEditingInfo])

  const updateMutation = trpc.engage.updateConversation.useMutation({
    onSuccess: () => {
      utils.engage.getConversation.invalidate({ id })
      toast({ title: 'Updated', description: 'Conversation updated successfully.' })
    },
    onError: (err) => {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      })
    },
  })

  const addNoteMutation = trpc.engage.addStaffNote.useMutation({
    onSuccess: () => {
      setNoteContent('')
      utils.engage.getConversation.invalidate({ id })
      toast({ title: 'Note added', description: 'Staff note saved successfully.' })
    },
    onError: (err) => {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      })
    },
  })

  const handleStatusChange = (status: string) => {
    updateMutation.mutate({
      id,
      status: status as (typeof STATUSES)[number],
    })
  }

  const handleSavePatientInfo = () => {
    updateMutation.mutate({
      id,
      patient_name: editName || null,
      patient_email: editEmail || null,
      patient_phone: editPhone || null,
    })
    setIsEditingInfo(false)
  }

  const handleAddNote = () => {
    if (!noteContent.trim()) return
    addNoteMutation.mutate({
      conversationId: id,
      content: noteContent.trim(),
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <p className="text-muted-foreground">Conversation not found.</p>
      </div>
    )
  }

  const messages = (conversation.messages as Message[]) ?? []
  const chatMessages = messages.filter((m) => m.role !== 'staff')
  const staffNotes = messages.filter((m) => m.role === 'staff')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/engage/conversations">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {conversation.patient_name || 'Anonymous Visitor'}
          </h1>
          <p className="text-sm text-muted-foreground">
            Started {format(new Date(conversation.created_at), 'MMM d, yyyy h:mm a')}
          </p>
        </div>
        <Badge
          className={STATUS_COLORS[conversation.status ?? 'active'] ?? ''}
          variant="secondary"
        >
          {conversation.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Chat Thread */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chat Thread</CardTitle>
              <CardDescription>
                {chatMessages.length} message{chatMessages.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {format(new Date(msg.created_at), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
                {chatMessages.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No messages in this conversation.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-4">
          {/* Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={conversation.status ?? 'active'}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Patient Info */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Patient Info</CardTitle>
                {!isEditingInfo && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingInfo(true)}
                  >
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditingInfo ? (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="edit-name">Name</Label>
                    <Input
                      id="edit-name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Patient name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      placeholder="Email address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-phone">Phone</Label>
                    <Input
                      id="edit-phone"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="Phone number"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSavePatientInfo}
                      disabled={updateMutation.isPending}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setIsEditingInfo(false)
                        setEditName(conversation.patient_name ?? '')
                        setEditEmail(conversation.patient_email ?? '')
                        setEditPhone(conversation.patient_phone ?? '')
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{conversation.patient_name || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{conversation.patient_email || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{conversation.patient_phone || 'Not provided'}</span>
                  </div>
                  {conversation.patient_dob && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{conversation.patient_dob}</span>
                    </div>
                  )}
                  {conversation.insurance_carrier && (
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span>{conversation.insurance_carrier}</span>
                    </div>
                  )}
                  {conversation.reason_for_visit && (
                    <div className="flex items-center gap-2 text-sm">
                      <Stethoscope className="h-4 w-4 text-muted-foreground" />
                      <span>{conversation.reason_for_visit}</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Staff Notes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Staff Notes</CardTitle>
              <CardDescription>
                Internal notes visible only to your team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {staffNotes.length > 0 && (
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {staffNotes.map((note) => (
                      <div
                        key={note.id}
                        className="p-2 rounded bg-orange-50 border border-orange-100"
                      >
                        <p className="text-sm">{note.content}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-muted-foreground">
                            {(note.metadata as Record<string, string>)
                              ?.author_name ?? 'Staff'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(note.created_at), 'MMM d, h:mm a')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {staffNotes.length > 0 && <Separator />}

                <div className="space-y-2">
                  <Textarea
                    placeholder="Add a note..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    rows={3}
                  />
                  <Button
                    size="sm"
                    onClick={handleAddNote}
                    disabled={
                      !noteContent.trim() || addNoteMutation.isPending
                    }
                    className="w-full"
                  >
                    {addNoteMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Add Note
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
