import { BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function TrainingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Training
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Track OSHA and HIPAA training assignments, progress, and completions.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-gray-300 bg-white/50 p-12 text-center">
        <BookOpen className="h-8 w-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">Training management migrating here</p>
        <p className="text-xs text-gray-400 mt-1">
          Currently available at{' '}
          <Link href="/dashboard/training" className="text-primary hover:underline">
            /dashboard/training
          </Link>
        </p>
      </div>
    </div>
  )
}
