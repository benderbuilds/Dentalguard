'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import {
  MessageSquare,
  Settings,
  Users,
  TrendingUp,
  ArrowRight,
  Percent,
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
import { trpc } from '@/lib/trpc/client'

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-blue-100 text-blue-800',
  lead: 'bg-yellow-100 text-yellow-800',
  booked: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
  spam: 'bg-red-100 text-red-800',
}

export default function EngagePage() {
  const { data: stats, isLoading } = trpc.engage.getDashboardStats.useQuery()
  const { data: config } = trpc.engage.getChatbotConfig.useQuery()
  const { data: recentData } = trpc.engage.getConversations.useQuery({
    limit: 5,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Engage</h1>
          <p className="text-muted-foreground">
            AI chatbot and conversation management
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/engage/config">
            <Settings className="h-4 w-4 mr-2" />
            Configure Chatbot
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats?.conversationsToday ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">conversations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats?.conversationsThisWeek ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">conversations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats?.totalLeads ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">pending follow-up</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Booked</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats?.totalBooked ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">appointments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : `${stats?.conversionRate ?? 0}%`}
            </div>
            <p className="text-xs text-muted-foreground">chat → booked</p>
          </CardContent>
        </Card>
      </div>

      {/* Chatbot Status + Recent Conversations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>Chatbot Status</CardTitle>
            <CardDescription>
              {config?.is_active
                ? 'Your chatbot is live and accepting conversations'
                : 'Your chatbot is not yet configured'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${
                  config?.is_active ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
              <span className="text-sm font-medium">
                {config?.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            {!config && (
              <Button className="mt-4" asChild>
                <Link href="/dashboard/engage/config">Set Up Chatbot</Link>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Recent Conversations */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Conversations</CardTitle>
              <CardDescription>Latest chatbot interactions</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/engage/conversations">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {!recentData ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : recentData.conversations.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No conversations yet. Once your chatbot is live, conversations
                will appear here.
              </p>
            ) : (
              <div className="space-y-3">
                {recentData.conversations.map((conv) => (
                  <Link
                    key={conv.id}
                    href={`/dashboard/engage/conversations/${conv.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">
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
                      {conv.reason_for_visit && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {conv.reason_for_visit}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground ml-4 whitespace-nowrap">
                      {format(new Date(conv.created_at), 'MMM d, h:mm a')}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
