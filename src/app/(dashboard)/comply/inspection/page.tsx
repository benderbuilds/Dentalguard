import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function InspectionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Inspection Packet
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Generate on-demand inspection readiness packets for OSHA and state audits.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-gray-300 bg-white/50 p-12 text-center">
        <AlertTriangle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">Inspection packet generator migrating here</p>
        <p className="text-xs text-gray-400 mt-1">
          Currently available at{' '}
          <Link href="/dashboard/inspection" className="text-primary hover:underline">
            /dashboard/inspection
          </Link>
        </p>
      </div>
    </div>
  )
}
