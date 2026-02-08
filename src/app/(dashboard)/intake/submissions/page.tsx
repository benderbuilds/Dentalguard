import { FileText } from 'lucide-react'

export default function SubmissionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Form Submissions
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Review and process patient intake form submissions.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-gray-300 bg-white/50 p-12 text-center">
        <FileText className="h-8 w-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">No submissions yet</p>
        <p className="text-xs text-gray-400 mt-1">
          Patient submissions will appear here once intake forms are configured
        </p>
      </div>
    </div>
  )
}
