import { appRouter } from '@/server/routers'
import { createCallerFactory } from '@/server/trpc'
import { createMockSupabaseClient, type MockSupabaseClient } from '../mocks/supabase'
import { createMockUser, createMockDbUser } from '../factories'

export type TestContext = {
  supabase: MockSupabaseClient
  user: ReturnType<typeof createMockUser> | null
  dbUser: ReturnType<typeof createMockDbUser> | null
  headers: Headers
}

type CreateTestCallerOptions = {
  user?: ReturnType<typeof createMockUser> | null
  dbUser?: ReturnType<typeof createMockDbUser> | null
  role?: 'employee' | 'admin' | 'org_admin'
}

const createCaller = createCallerFactory(appRouter)

export function createTestCaller(options: CreateTestCallerOptions = {}) {
  const { role = 'employee' } = options

  const mockSupabase = createMockSupabaseClient()

  let user = options.user
  let dbUser = options.dbUser

  // Create default user/dbUser based on role
  if (user === undefined) {
    user = createMockUser()
  }

  if (dbUser === undefined) {
    if (user) {
      dbUser = createMockDbUser({
        id: user.id,
        role: role === 'org_admin' ? 'admin' : role,
        is_org_admin: role === 'org_admin',
      })
    } else {
      dbUser = null
    }
  }

  const ctx: TestContext = {
    supabase: mockSupabase as any,
    user,
    dbUser,
    headers: new Headers(),
  }

  return {
    caller: createCaller(ctx as any),
    ctx,
    mockSupabase,
  }
}

// Create an unauthenticated caller
export function createUnauthenticatedCaller() {
  return createTestCaller({ user: null, dbUser: null })
}

// Create an employee caller
export function createEmployeeCaller(overrides?: Partial<ReturnType<typeof createMockDbUser>>) {
  const dbUser = createMockDbUser({ role: 'employee', ...overrides })
  const user = createMockUser({ id: dbUser.id })
  return createTestCaller({ user, dbUser })
}

// Create an admin caller
export function createAdminCaller(overrides?: Partial<ReturnType<typeof createMockDbUser>>) {
  const dbUser = createMockDbUser({ role: 'admin', ...overrides })
  const user = createMockUser({ id: dbUser.id })
  return createTestCaller({ user, dbUser })
}

// Create an org admin caller
export function createOrgAdminCaller(overrides?: Partial<ReturnType<typeof createMockDbUser>>) {
  const dbUser = createMockDbUser({ role: 'admin', is_org_admin: true, ...overrides })
  const user = createMockUser({ id: dbUser.id })
  return createTestCaller({ user, dbUser })
}
