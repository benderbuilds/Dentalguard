import { Settings, Database, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Practice Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your practice profile, billing, and integrations.
        </p>
      </div>

      <Link
        href="/settings/open-dental"
        className="group flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 hover:border-primary/30 hover:shadow-sm transition-all duration-200"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/[0.08]">
          <Database className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors">
            Open Dental Integration
          </h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Connect your Open Dental PMS for live scheduling and patient sync
          </p>
        </div>
        <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all mt-0.5" />
      </Link>

      <div className="rounded-xl border border-dashed border-gray-300 bg-white/50 p-8 text-center">
        <Settings className="h-8 w-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">
          Practice profile, billing, and team management coming soon
        </p>
      </div>
    </div>
  )
}
