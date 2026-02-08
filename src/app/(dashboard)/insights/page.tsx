import { BarChart3 } from 'lucide-react'

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Practice Insights
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Analytics, trends, and AI-generated morning summaries for your practice.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-gray-300 bg-white/50 p-12 text-center">
        <BarChart3 className="h-8 w-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">
          Practice analytics coming soon
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Appointment trends, patient engagement metrics, and AI morning summaries
        </p>
      </div>
    </div>
  )
}
