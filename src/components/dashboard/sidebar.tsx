'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  Settings,
  Shield,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Employees',
    href: '/dashboard/employees',
    icon: Users,
  },
  {
    name: 'Training',
    href: '/dashboard/training',
    icon: BookOpen,
  },
  {
    name: 'Documents',
    href: '/dashboard/documents',
    icon: FileText,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

interface SidebarProps {
  complianceStats?: {
    overdueCount: number
    dueSoonCount: number
  }
}

export function Sidebar({ complianceStats }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-64 bg-white border-r min-h-screen">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-primary">DentalGuard</span>
        </Link>
      </div>

      {/* Compliance Alert */}
      {complianceStats && complianceStats.overdueCount > 0 && (
        <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium text-sm">
              {complianceStats.overdueCount} overdue
            </span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
              {item.name === 'Employees' && complianceStats?.overdueCount ? (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {complianceStats.overdueCount}
                </span>
              ) : null}
            </Link>
          )
        })}
      </nav>

      {/* Inspection Mode Button */}
      <div className="p-4 border-t">
        <Button
          variant="outline"
          className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
          asChild
        >
          <Link href="/dashboard/inspection">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Inspector Here
          </Link>
        </Button>
      </div>
    </div>
  )
}
