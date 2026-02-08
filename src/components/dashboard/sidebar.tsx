'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Shield,
  MessageCircle,
  ClipboardList,
  BarChart3,
  Settings,
  ChevronRight,
  Lock,
  Menu,
  X,
  LogOut,
  Users,
  BookOpen,
  FileText,
  LayoutDashboard,
  Wrench,
  MessageSquare,
  Database,
  Sparkles,
  Settings,
  Shield,
  AlertTriangle,
  MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { createClient } from '@/lib/supabase/client'

// ---------------------------------------------------------------------------
// Plan gating
// ---------------------------------------------------------------------------
type Plan = 'comply' | 'engage' | 'complete'

const PLAN_LEVEL: Record<Plan, number> = {
  comply: 0,
  engage: 1,
  complete: 2,
}

function hasAccess(current: Plan, required: Plan): boolean {
  return PLAN_LEVEL[current] >= PLAN_LEVEL[required]
}

// ---------------------------------------------------------------------------
// Navigation data
// ---------------------------------------------------------------------------
type NavItem = {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

type NavSection = {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  requiredPlan: Plan
  items: NavItem[]
}

const NAV_SECTIONS: NavSection[] = [
  {
    id: 'comply',
    label: 'Comply',
    icon: Shield,
    href: '/comply',
    requiredPlan: 'comply',
    items: [
      { label: 'Overview', href: '/comply', icon: LayoutDashboard },
      { label: 'Employees', href: '/comply/employees', icon: Users },
      { label: 'Training', href: '/comply/training', icon: BookOpen },
      { label: 'Documents', href: '/comply/documents', icon: FileText },
    ],
  },
  {
    id: 'engage',
    label: 'Engage',
    icon: MessageCircle,
    href: '/engage',
    requiredPlan: 'engage',
    items: [
      { label: 'Dashboard', href: '/engage', icon: LayoutDashboard },
      { label: 'Configuration', href: '/engage/config', icon: Wrench },
      { label: 'Conversations', href: '/engage/conversations', icon: MessageSquare },
    ],
  },
  {
    id: 'intake',
    label: 'Intake',
    icon: ClipboardList,
    href: '/intake',
    requiredPlan: 'complete',
    items: [
      { label: 'Overview', href: '/intake', icon: LayoutDashboard },
      { label: 'Submissions', href: '/intake/submissions', icon: FileText },
    ],
  },
  {
    id: 'insights',
    label: 'Insights',
    icon: BarChart3,
    href: '/insights',
    requiredPlan: 'complete',
    items: [],
    name: 'Engage',
    href: '/dashboard/engage',
    icon: MessageSquare,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

const SETTINGS_SECTION: NavSection = {
  id: 'settings',
  label: 'Settings',
  icon: Settings,
  href: '/settings',
  requiredPlan: 'comply',
  items: [
    { label: 'General', href: '/settings', icon: Settings },
    { label: 'Open Dental', href: '/settings/open-dental', icon: Database },
  ],
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
interface SidebarProps {
  user: {
    name: string
    email: string
    avatar_url?: string | null
    role: string
  }
  practiceName?: string
  plan?: Plan
}

export function Sidebar({ user, practiceName, plan = 'engage' }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Auto-expand whichever section is active on first render / route change
  useEffect(() => {
    const allSections = [...NAV_SECTIONS, SETTINGS_SECTION]
    const active = allSections.find(
      (s) => pathname === s.href || pathname.startsWith(s.href + '/')
    )
    if (active && !expandedSections.includes(active.id)) {
      setExpandedSections((prev) => [...prev, active.id])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Close mobile sidebar on navigation
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  function toggleSection(id: string) {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  async function handleSignOut() {
    setIsLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  // ---- Section renderer ----
  function renderSection(section: NavSection) {
    const locked = !hasAccess(plan, section.requiredPlan)
    const active =
      pathname === section.href || pathname.startsWith(section.href + '/')
    const expanded = expandedSections.includes(section.id)
    const hasItems = section.items.length > 0
    const Icon = section.icon

    const header = (
      <button
        onClick={() => {
          if (locked) return
          if (hasItems) {
            toggleSection(section.id)
          } else {
            router.push(section.href)
          }
        }}
        className={cn(
          'group/nav w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150',
          locked
            ? 'text-gray-400 cursor-not-allowed'
            : active
              ? 'text-primary bg-primary/[0.08]'
              : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
        )}
      >
        <Icon
          className={cn(
            'h-[18px] w-[18px] flex-shrink-0 transition-colors duration-150',
            active && !locked ? 'text-primary' : ''
          )}
        />
        <span className="flex-1 text-left">{section.label}</span>
        {locked ? (
          <Lock className="h-3.5 w-3.5 text-gray-400" />
        ) : hasItems ? (
          <ChevronRight
            className={cn(
              'h-3.5 w-3.5 text-gray-400 transition-transform duration-200',
              expanded && 'rotate-90'
            )}
          />
        ) : null}
      </button>
    )

    return (
      <div key={section.id}>
        {locked ? (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>{header}</TooltipTrigger>
              <TooltipContent side="right" className="text-xs font-medium">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3" />
                  Upgrade to unlock {section.label}
                </span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          header
        )}

        {/* Collapsible sub-items — CSS grid trick for smooth height animation */}
        {hasItems && !locked && (
          <div
            className={cn(
              'grid transition-[grid-template-rows] duration-200 ease-out',
              expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            )}
          >
            <div className="overflow-hidden">
              <div className="pl-[18px] mt-0.5 space-y-px border-l border-gray-200/60 ml-[21px]">
                {section.items.map((item) => {
                  const ItemIcon = item.icon
                  const itemActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2.5 pl-3 pr-2 py-[6px] rounded-md text-[13px] transition-all duration-150',
                        itemActive
                          ? 'text-primary font-medium bg-primary/[0.06]'
                          : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                      )}
                    >
                      <ItemIcon className="h-3.5 w-3.5 flex-shrink-0" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ---- Sidebar content (shared between desktop & mobile) ----
  const content = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-14 flex-shrink-0">
        <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center shadow-sm">
          <Shield className="h-4 w-4 text-white" />
        </div>
        <span className="font-semibold text-[15px] tracking-tight text-gray-900">
          DentalPilot
        </span>
      </div>

      {/* Practice name badge */}
      {practiceName && (
        <div className="px-5 pb-2">
          <p className="text-[11px] text-gray-500 font-medium truncate">
            {practiceName}
          </p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 pt-2 pb-4 space-y-0.5 overflow-y-auto scrollbar-thin">
        {/* Section label */}
        <p className="px-3 pt-1 pb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest select-none">
          Modules
        </p>

        {NAV_SECTIONS.map(renderSection)}

        {/* Divider */}
        <div className="py-3">
          <div className="h-px bg-gray-200/70 mx-2" />
        </div>

        {renderSection(SETTINGS_SECTION)}
      </nav>

      {/* User section */}
      <div className="border-t border-gray-200/70 p-3 flex-shrink-0">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={user.avatar_url || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate leading-tight">
              {user.name}
            </p>
            <p className="text-[11px] text-gray-500 truncate leading-tight">
              {user.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          disabled={isLoggingOut}
          className="mt-1 w-full flex items-center gap-2 px-4 py-1.5 text-[13px] text-gray-500 hover:text-red-600 hover:bg-red-50/60 rounded-md transition-colors duration-150 disabled:opacity-50"
        >
          <LogOut className="h-3.5 w-3.5" />
          {isLoggingOut ? 'Signing out...' : 'Sign out'}
        </button>
      </div>
    </div>
  )

  // ---- Render ----
  return (
    <>
      {/* ===== Mobile top bar ===== */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-lg border-b border-gray-200/60 flex items-center px-4 z-30 md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5 text-gray-700" />
        </button>
        <div className="flex items-center gap-2 ml-2">
          <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center">
            <Shield className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-semibold text-sm text-gray-900 tracking-tight">
            DentalPilot
          </span>
        </div>
      </div>

      {/* ===== Desktop sidebar ===== */}
      <aside className="hidden md:flex flex-col w-60 bg-[#FAFAF9] border-r border-gray-200/80 min-h-screen sticky top-0 h-screen">
        {content}
      </aside>

      {/* ===== Mobile sidebar overlay ===== */}
      <div
        className={cn(
          'fixed inset-0 z-40 md:hidden',
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            'absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300',
            mobileOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
        {/* Panel */}
        <aside
          className={cn(
            'relative w-72 h-full bg-white shadow-2xl transition-transform duration-300 ease-out',
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          {/* Close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-3.5 right-3 p-1.5 rounded-lg hover:bg-gray-100 transition-colors z-10"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
          {content}
        </aside>
      </div>
    </>
  )
}
