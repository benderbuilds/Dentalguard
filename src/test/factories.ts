import { randomUUID } from 'crypto'

export function createMockUser(overrides: Record<string, unknown> = {}) {
  return {
    id: randomUUID(),
    email: 'test@example.com',
    app_metadata: {},
    user_metadata: { name: 'Test User' },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    ...overrides,
  }
}

export function createMockDbUser(overrides: Record<string, unknown> = {}) {
  return {
    id: randomUUID(),
    email: 'test@example.com',
    name: 'Test User',
    role: 'employee' as const,
    status: 'active' as const,
    organization_id: randomUUID(),
    practice_id: randomUUID(),
    is_org_admin: false,
    job_title: null,
    phone: null,
    hire_date: null,
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }
}
