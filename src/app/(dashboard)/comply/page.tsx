import Link from 'next/link'
import {
  Shield,
  Users,
  BookOpen,
  FileText,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react'

const modules = [
  {
    title: 'Employees',
    description: 'Manage staff records, certifications, and compliance status',
    href: '/comply/employees',
    icon: Users,
  },
  {
    title: 'Training',
    description: 'Track OSHA and HIPAA training assignments and completions',
    href: '/comply/training',
    icon: BookOpen,
  },
  {
    title: 'Documents',
    description: 'Access compliance documents, SOPs, and policy templates',
    href: '/comply/documents',
    icon: FileText,
  },
  {
    title: 'Inspection Packet',
    description: 'Generate on-demand inspection readiness packets',
    href: '/comply/inspection',
    icon: AlertTriangle,
  },
]

export default function ComplyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Compliance Overview
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitor your practice&apos;s OSHA and HIPAA compliance status.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {modules.map((mod) => {
          const Icon = mod.icon
          return (
            <Link
              key={mod.href}
              href={mod.href}
              className="group relative rounded-xl border border-gray-200 bg-white p-5 hover:border-primary/30 hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/[0.08]">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {mod.description}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all mt-0.5" />
              </div>
            </Link>
          )
        })}
      </div>

      <div className="rounded-xl border border-dashed border-gray-300 bg-white/50 p-8 text-center">
        <Shield className="h-8 w-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">
          Compliance dashboard with live stats coming soon
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Your existing compliance tools are still available at{' '}
          <Link href="/dashboard" className="text-primary hover:underline">
            /dashboard
          </Link>
        </p>
      </div>
    </div>
  )
}
