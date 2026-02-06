export type MockSupabaseClient = {
  auth: {
    getUser: (...args: any[]) => any
  }
  from: (...args: any[]) => any
}

export function createMockSupabaseClient(): MockSupabaseClient {
  const mockFn = () => ({ data: null, error: null })

  const chainable: Record<string, any> = {}
  const methods = [
    'select', 'insert', 'update', 'delete',
    'eq', 'neq', 'gt', 'gte', 'lt', 'lte',
    'order', 'limit',
  ]
  for (const method of methods) {
    chainable[method] = (..._args: any[]) => chainable
  }
  chainable.single = async () => ({ data: null, error: null })
  chainable.maybeSingle = async () => ({ data: null, error: null })

  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
    },
    from: () => chainable,
  }
}
