'use client'

import { useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { trpc } from '@/lib/trpc/client'

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-blue-100 text-blue-800',
  lead: 'bg-yellow-100 text-yellow-800',
  booked: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
  spam: 'bg-red-100 text-red-800',
}

const STATUSES = ['all', 'active', 'lead', 'booked', 'closed', 'spam'] as const
const PAGE_SIZE = 25

export default function ConversationsPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  )
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(0)

  const { data, isLoading } = trpc.engage.getConversations.useQuery({
    status: statusFilter as
      | 'active'
      | 'lead'
      | 'booked'
      | 'closed'
      | 'spam'
      | undefined,
    search: search || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo ? `${dateTo}T23:59:59.999Z` : undefined,
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
  })

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0

  const handleSearch = () => {
    setSearch(searchInput)
    setPage(0)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  const handleStatusChange = (status: string) => {
    setStatusFilter(status === 'all' ? undefined : status)
    setPage(0)
  }

  const handleDateFromChange = (value: string) => {
    setDateFrom(value)
    setPage(0)
  }

  const handleDateToChange = (value: string) => {
    setDateTo(value)
    setPage(0)
  }

  const clearFilters = () => {
    setStatusFilter(undefined)
    setSearch('')
    setSearchInput('')
    setDateFrom('')
    setDateTo('')
    setPage(0)
  }

  const hasFilters = statusFilter || search || dateFrom || dateTo

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Conversations</h1>
        <p className="text-muted-foreground">
          {data ? `${data.total} conversation${data.total !== 1 ? 's' : ''}` : 'Loading...'}
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Status Filter */}
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((status) => (
            <Button
              key={status}
              variant={
                (status === 'all' && !statusFilter) ||
                status === statusFilter
                  ? 'default'
                  : 'outline'
              }
              size="sm"
              onClick={() => handleStatusChange(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>

        {/* Search + Date Range */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-9"
            />
          </div>
          <Button variant="secondary" size="default" onClick={handleSearch}>
            Search
          </Button>

          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => handleDateFromChange(e.target.value)}
              className="w-[150px]"
            />
            <span className="text-sm text-muted-foreground">to</span>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => handleDateToChange(e.target.value)}
              className="w-[150px]"
            />
          </div>

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Conversation List */}
      <div className="space-y-2">
        {isLoading && (
          <p className="text-sm text-muted-foreground p-4">
            Loading conversations...
          </p>
        )}

        {data?.conversations.map((conv) => (
          <Link
            key={conv.id}
            href={`/dashboard/engage/conversations/${conv.id}`}
          >
            <Card className="cursor-pointer transition-colors hover:bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {conv.patient_name || 'Anonymous'}
                      </span>
                      <Badge
                        className={
                          STATUS_COLORS[conv.status ?? 'active'] ?? ''
                        }
                        variant="secondary"
                      >
                        {conv.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>
                        {format(
                          new Date(conv.created_at),
                          'MMM d, yyyy h:mm a'
                        )}
                      </span>
                      {conv.patient_email && <span>{conv.patient_email}</span>}
                      {conv.patient_phone && <span>{conv.patient_phone}</span>}
                    </div>
                    {conv.reason_for_visit && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {conv.reason_for_visit}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground ml-4">
                    {(
                      conv.messages as Array<{
                        id: string
                        role: string
                        content: string
                        created_at: string
                      }>
                    )?.length ?? 0}{' '}
                    messages
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {data?.conversations.length === 0 && (
          <p className="text-sm text-muted-foreground p-4 text-center">
            No conversations found.
          </p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
