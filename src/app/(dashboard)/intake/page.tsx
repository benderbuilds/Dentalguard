import { ClipboardList, FileText, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function IntakePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Patient Intake
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Digital patient intake forms — eliminate paper and streamline check-in.
        </p>
      </div>

      <Link
        href="/intake/submissions"
        className="group flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 hover:border-primary/30 hover:shadow-sm transition-all duration-200"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/[0.08]">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors">
            Form Submissions
          </h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            View and manage patient intake form submissions
          </p>
        </div>
        <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all mt-0.5" />
      </Link>

      <div className="rounded-xl border border-dashed border-gray-300 bg-white/50 p-8 text-center">
        <ClipboardList className="h-8 w-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">
          Intake form builder and analytics coming soon
        </p>
      </div>
    </div>
  )
}
