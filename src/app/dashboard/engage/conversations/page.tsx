'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { trpc } from '@/lib/trpc/client'

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-blue-100 text-blue-800',
  lead: 'bg-yellow-100 text-yellow-800',
  booked: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
  spam: 'bg-red-100 text-red-800',
}

export default function ConversationsPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const { data, isLoading } = trpc.engage.getConversations.useQuery({
    status: statusFilter as 'active' | 'lead' | 'booked' | 'closed' | 'spam' | undefined,
    limit: 50,
  })

  const { data: selectedConversation } = trpc.engage.getConversation.useQuery(
    { id: selectedId! },
    { enabled: !!selectedId }
  )

  const statuses = ['all', 'active', 'lead', 'booked', 'closed', 'spam'] as const

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Conversations</h1>
        <p className="text-muted-foreground">
          {data ? `${data.total} total conversations` : 'Loading...'}
        </p>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2">
        {statuses.map((status) => (
          <Button
            key={status}
            variant={
              (status === 'all' && !statusFilter) || status === statusFilter
                ? 'default'
                : 'outline'
            }
            size="sm"
            onClick={() => setStatusFilter(status === 'all' ? undefined : status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversation List */}
        <div className="lg:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto">
          {isLoading && (
            <p className="text-sm text-muted-foreground p-4">Loading conversations...</p>
          )}
          {data?.conversations.map((conv) => (
            <Card
              key={conv.id}
              className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                selectedId === conv.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedId(conv.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">
                    {conv.patient_name || 'Anonymous'}
                  </span>
                  <Badge className={STATUS_COLORS[conv.status ?? 'active'] ?? ''} variant="secondary">
                    {conv.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(conv.created_at), 'MMM d, yyyy h:mm a')}
                </p>
                {conv.reason_for_visit && (
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {conv.reason_for_visit}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
          {data?.conversations.length === 0 && (
            <p className="text-sm text-muted-foreground p-4 text-center">
              No conversations found.
            </p>
          )}
        </div>

        {/* Conversation Detail */}
        <div className="lg:col-span-2">
          {selectedConversation ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {selectedConversation.patient_name || 'Anonymous Visitor'}
                  </CardTitle>
                  <Badge
                    className={STATUS_COLORS[selectedConversation.status ?? 'active'] ?? ''}
                    variant="secondary"
                  >
                    {selectedConversation.status}
                  </Badge>
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  {selectedConversation.patient_email && (
                    <span>{selectedConversation.patient_email}</span>
                  )}
                  {selectedConversation.patient_phone && (
                    <span>{selectedConversation.patient_phone}</span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[50vh] overflow-y-auto">
                  {(selectedConversation.messages as Array<{
                    id: string
                    role: string
                    content: string
                    created_at: string
                  }>)?.map((msg) => (
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
                            : msg.role === 'staff'
                            ? 'bg-orange-100 text-orange-900'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {format(new Date(msg.created_at), 'h:mm a')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Select a conversation to view its messages
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
