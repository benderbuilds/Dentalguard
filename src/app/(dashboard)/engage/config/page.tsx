import { Wrench } from 'lucide-react'

export default function ChatbotConfigPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Chatbot Configuration
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Customize your AI chatbot&apos;s personality, knowledge base, and behavior.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-gray-300 bg-white/50 p-12 text-center">
        <Wrench className="h-8 w-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">
          Chatbot configuration panel coming soon
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Set up services, providers, hours, insurance, and more
        </p>
      </div>
    </div>
  )
}
