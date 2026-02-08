export interface WidgetConfig {
  botName: string
  welcomeMessage: string
  primaryColor: string
  logoUrl: string | null
  officeHours: Record<string, { open: string; close: string }> | null
  practiceName: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export interface SSEEvent {
  type: 'token' | 'done' | 'error'
  content?: string
  conversationId?: string
  message?: string
  metadata?: {
    isAfterHours?: boolean
    extractedInfo?: Record<string, unknown>
  }
}
