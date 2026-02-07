import { MessageSquare } from 'lucide-react'

export default function ConversationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Conversations
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Review patient conversations from your website chatbot.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-gray-300 bg-white/50 p-12 text-center">
        <MessageSquare className="h-8 w-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">
          No conversations yet
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Conversations will appear here once your chatbot widget is installed
        </p>
      </div>
    </div>
  )
}
