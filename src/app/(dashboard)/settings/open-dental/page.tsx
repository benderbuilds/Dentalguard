import { Database } from 'lucide-react'

export default function OpenDentalSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Open Dental Integration
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Connect and configure your Open Dental practice management system.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-gray-300 bg-white/50 p-12 text-center">
        <Database className="h-8 w-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">
          Open Dental connection setup coming soon
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Enter your Customer Key to sync patients, appointments, and providers
        </p>
      </div>
    </div>
  )
}
