'use client'

import Link from 'next/link'
import { MessageSquare, Settings, Users, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { trpc } from '@/lib/trpc/client'

export default function EngagePage() {
  const { data: stats, isLoading } = trpc.engage.getDashboardStats.useQuery()
  const { data: config } = trpc.engage.getChatbotConfig.useQuery()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Engage</h1>
          <p className="text-muted-foreground">AI chatbot and conversation management</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/engage/config">
            <Settings className="h-4 w-4 mr-2" />
            Configure Chatbot
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
      </div>

      {/* Status + Embed Code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <Card>
          <CardHeader>
            <CardTitle>Embed Code</CardTitle>
            <CardDescription>
              Add this script tag to your website to enable the chatbot
            </CardDescription>
          </CardHeader>
          <CardContent>
            {config?.embed_key ? (
              <div className="bg-muted p-3 rounded-lg">
                <code className="text-xs break-all">
                  {`<script src="${typeof window !== 'undefined' ? window.location.origin : ''}/widget.js" data-key="${config.embed_key}" async></script>`}
                </code>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Configure your chatbot first to get the embed code.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Conversations</CardTitle>
          <CardDescription>View and manage chatbot conversations</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" asChild>
            <Link href="/dashboard/engage/conversations">View All Conversations</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
