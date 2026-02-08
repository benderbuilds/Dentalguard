'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { trpc } from '@/lib/trpc/client'
import { cn } from '@/lib/utils'
import {
  Send,
  Loader2,
  MessageCircle,
  User,
  Bot,
  RefreshCw,
  Info,
} from 'lucide-react'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ExtractedInfo {
  patient_name?: string | null
  patient_phone?: string | null
  patient_email?: string | null
  patient_dob?: string | null
  insurance_carrier?: string | null
  reason_for_visit?: string | null
  is_new_patient?: boolean | null
}

interface DoneMetadata {
  isAfterHours?: boolean
  extractedInfo?: ExtractedInfo
}

export default function TestChatPage() {
  const { data: config, isLoading: configLoading } = trpc.engage.getChatbotConfig.useQuery()

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [sessionId] = useState(() => `test-${crypto.randomUUID()}`)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<DoneMetadata>({})
  const [error, setError] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const embedKey = config?.embed_key as string | undefined

  const sendMessage = async () => {
    if (!input.trim() || !embedKey || isStreaming) return

    const userMessage = input.trim()
    setInput('')
    setError(null)
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setIsStreaming(true)

    // Add placeholder for assistant response
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embedKey,
          sessionId,
          message: userMessage,
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to send message')
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response stream')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const jsonStr = line.slice(6)

          try {
            const event = JSON.parse(jsonStr)

            if (event.type === 'token') {
              setMessages((prev) => {
                const updated = [...prev]
                const last = updated[updated.length - 1]
                if (last?.role === 'assistant') {
                  updated[updated.length - 1] = {
                    ...last,
                    content: last.content + event.content,
                  }
                }
                return updated
              })
            } else if (event.type === 'done') {
              setConversationId(event.conversationId)
              if (event.metadata) {
                setMetadata(event.metadata)
              }
            } else if (event.type === 'error') {
              setMessages((prev) => {
                const updated = [...prev]
                const last = updated[updated.length - 1]
                if (last?.role === 'assistant' && !last.content) {
                  updated[updated.length - 1] = {
                    ...last,
                    content: event.message,
                  }
                }
                return updated
              })
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setError(msg)
      // Remove empty assistant placeholder on error
      setMessages((prev) => {
        const last = prev[prev.length - 1]
        if (last?.role === 'assistant' && !last.content) {
          return prev.slice(0, -1)
        }
        return prev
      })
    } finally {
      setIsStreaming(false)
      inputRef.current?.focus()
    }
  }

  const resetChat = () => {
    setMessages([])
    setConversationId(null)
    setMetadata({})
    setError(null)
  }

  if (configLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!embedKey) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Test Chat</h1>
        <Card>
          <CardContent className="py-8 text-center">
            <MessageCircle className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">
              No chatbot configured yet. Please{' '}
              <a href="/dashboard/engage/config" className="underline text-primary">
                configure your chatbot
              </a>{' '}
              first.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const extractedInfo = metadata.extractedInfo ?? {}
  const infoFields: { label: string; key: keyof ExtractedInfo }[] = [
    { label: 'Name', key: 'patient_name' },
    { label: 'Phone', key: 'patient_phone' },
    { label: 'Email', key: 'patient_email' },
    { label: 'DOB', key: 'patient_dob' },
    { label: 'Insurance', key: 'insurance_carrier' },
    { label: 'Reason', key: 'reason_for_visit' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Test Chat</h1>
          <p className="text-muted-foreground">
            Test your AI chatbot with live API calls
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={resetChat} className="gap-1.5">
          <RefreshCw className="h-4 w-4" />
          Reset
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        {/* Chat Area */}
        <Card className="flex flex-col h-[600px]">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center gap-2">
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: (config?.primary_color as string) ?? '#2563eb' }}
              >
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-base">{config?.bot_name ?? 'Practice Assistant'}</CardTitle>
                <CardDescription className="text-xs">
                  Embed key: {embedKey.slice(0, 8)}...
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <MessageCircle className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Send a message to start testing
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
                    {['I need to schedule a cleaning', 'Do you accept Delta Dental?', 'What are your hours?'].map(
                      (suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => {
                            setInput(suggestion)
                            inputRef.current?.focus()
                          }}
                          className="text-xs px-3 py-1.5 rounded-full border hover:bg-muted transition-colors"
                        >
                          {suggestion}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  'flex gap-2',
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {msg.role === 'assistant' && (
                  <div
                    className="h-7 w-7 rounded-full shrink-0 flex items-center justify-center mt-0.5"
                    style={{ backgroundColor: (config?.primary_color as string) ?? '#2563eb' }}
                  >
                    <Bot className="h-3.5 w-3.5 text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    'rounded-xl px-3.5 py-2.5 max-w-[80%] text-sm',
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  {msg.content || (
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Thinking...
                    </span>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="h-7 w-7 rounded-full shrink-0 flex items-center justify-center mt-0.5 bg-primary/10">
                    <User className="h-3.5 w-3.5 text-primary" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input */}
          <div className="border-t p-3">
            {error && (
              <p className="text-xs text-destructive mb-2">{error}</p>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                sendMessage()
              }}
              className="flex gap-2"
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                disabled={isStreaming}
                autoFocus
              />
              <Button type="submit" size="icon" disabled={isStreaming || !input.trim()}>
                {isStreaming ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </Card>

        {/* Metadata Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-1.5">
                <Info className="h-4 w-4" />
                Extracted Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {infoFields.map(({ label, key }) => {
                const value = extractedInfo[key]
                return (
                  <div key={key}>
                    <Label className="text-xs text-muted-foreground">{label}</Label>
                    <p className="text-sm">
                      {value !== null && value !== undefined
                        ? String(value)
                        : <span className="text-muted-foreground/50">--</span>}
                    </p>
                  </div>
                )
              })}
              <div>
                <Label className="text-xs text-muted-foreground">New Patient</Label>
                <p className="text-sm">
                  {extractedInfo.is_new_patient === true
                    ? 'Yes'
                    : extractedInfo.is_new_patient === false
                    ? 'No'
                    : <span className="text-muted-foreground/50">--</span>}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Session Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <div>
                <Label className="text-xs text-muted-foreground">Session ID</Label>
                <p className="text-xs font-mono break-all">{sessionId}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Conversation ID</Label>
                <p className="text-xs font-mono break-all">
                  {conversationId ?? <span className="text-muted-foreground/50">Not started</span>}
                </p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">After Hours</Label>
                <p className="text-sm">
                  {metadata.isAfterHours !== undefined ? (
                    <Badge variant={metadata.isAfterHours ? 'warning' : 'success'}>
                      {metadata.isAfterHours ? 'Yes' : 'No'}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground/50">--</span>
                  )}
                </p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Messages</Label>
                <p className="text-sm">{messages.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
