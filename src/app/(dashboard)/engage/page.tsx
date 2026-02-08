import { MessageCircle, Wrench, MessageSquare, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const features = [
  {
    title: 'Configuration',
    description: 'Set up your chatbot personality, hours, services, and FAQs',
    href: '/engage/config',
    icon: Wrench,
  },
  {
    title: 'Conversations',
    description: 'View and manage patient conversations from your website chatbot',
    href: '/engage/conversations',
    icon: MessageSquare,
  },
]

export default function EngagePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Chatbot Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your AI-powered website chatbot and patient conversations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Link
              key={feature.href}
              href={feature.href}
              className="group relative rounded-xl border border-gray-200 bg-white p-5 hover:border-primary/30 hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/[0.08]">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all mt-0.5" />
              </div>
            </Link>
          )
        })}
      </div>

      <div className="rounded-xl border border-dashed border-gray-300 bg-white/50 p-8 text-center">
        <MessageCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">
          Chat analytics and performance metrics coming soon
        </p>
      </div>
    </div>
  )
}
