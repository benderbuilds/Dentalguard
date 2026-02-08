import type { WidgetConfig, SSEEvent } from './types'

export async function fetchWidgetConfig(
  apiBaseUrl: string,
  embedKey: string
): Promise<WidgetConfig> {
  const res = await fetch(`${apiBaseUrl}/api/widget/config?key=${embedKey}`)
  if (!res.ok) throw new Error('Failed to load widget config')
  return res.json()
}

export async function sendChatMessage(
  apiBaseUrl: string,
  embedKey: string,
  sessionId: string,
  message: string,
  onToken: (token: string) => void,
  onDone: (event: SSEEvent) => void,
  onError: (message: string) => void
): Promise<void> {
  const res = await fetch(`${apiBaseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ embedKey, sessionId, message }),
  })

  if (!res.ok || !res.body) {
    const err = await res.json().catch(() => ({ error: 'Chat request failed' }))
    throw new Error(err.error || 'Chat request failed')
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      try {
        const event: SSEEvent = JSON.parse(line.slice(6))
        if (event.type === 'token' && event.content) {
          onToken(event.content)
        } else if (event.type === 'done') {
          onDone(event)
        } else if (event.type === 'error') {
          onError(
            event.message ??
              "I'm sorry, I'm having trouble connecting. Please try again or call the office."
          )
        }
      } catch {
        // Skip malformed JSON
      }
    }
  }
}

export function getSessionId(): string {
  const key = 'dp_session_id'
  let sessionId: string | null = null
  try {
    sessionId = localStorage.getItem(key)
  } catch {
    // localStorage unavailable (e.g. incognito)
  }
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    try {
      localStorage.setItem(key, sessionId)
    } catch {
      // Ignore
    }
  }
  return sessionId
}
