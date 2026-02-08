import { Users } from 'lucide-react'
import Link from 'next/link'

export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Employees
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage staff records, certifications, and compliance tracking.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-gray-300 bg-white/50 p-12 text-center">
        <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">Employee management migrating here</p>
        <p className="text-xs text-gray-400 mt-1">
          Currently available at{' '}
          <Link href="/dashboard/employees" className="text-primary hover:underline">
            /dashboard/employees
          </Link>
        </p>
      </div>
    </div>
  )
}
