import React, { useState, useRef, useEffect, useCallback } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface ChatWindowProps {
  embedKey: string
  apiBaseUrl: string
  config: {
    botName: string
    welcomeMessage: string
    primaryColor: string
    logoUrl: string | null
    practiceName: string
  }
  onClose: () => void
}

function getSessionId(): string {
  const key = 'dp_session_id'
  let sessionId = localStorage.getItem(key)
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem(key, sessionId)
  }
  return sessionId
}

export function ChatWindow({ embedKey, apiBaseUrl, config, onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: config.welcomeMessage,
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const sessionId = useRef(getSessionId())

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    const assistantId = `assistant-${Date.now()}`

    try {
      const response = await fetch(`${apiBaseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embedKey,
          sessionId: sessionId.current,
          message: text,
        }),
      })

      if (!response.ok || !response.body) {
        throw new Error('Chat request failed')
      }

      // Add empty assistant message that we'll stream into
      setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }])

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // Process SSE lines
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? '' // Keep incomplete line in buffer

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const jsonStr = line.slice(6)

          try {
            const event = JSON.parse(jsonStr)
            if (event.type === 'token') {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: m.content + event.content } : m
                )
              )
            } else if (event.type === 'error') {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: event.message } : m
                )
              )
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: 'assistant',
          content: "I'm sorry, I'm having trouble connecting right now. Please try again or call the office directly.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const color = config.primaryColor || '#2563eb'

  return (
    <div className="dp-chat-window">
      {/* Header */}
      <div className="dp-chat-header" style={{ backgroundColor: color }}>
        <div className="dp-chat-header-info">
          <div className="dp-chat-header-avatar">
            {config.botName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="dp-chat-header-name">{config.botName}</div>
            <div className="dp-chat-header-status">
              {config.practiceName}
            </div>
          </div>
        </div>
        <button className="dp-chat-close" onClick={onClose} aria-label="Close chat">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="dp-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`dp-message ${
              msg.role === 'user' ? 'dp-message-user' : 'dp-message-assistant'
            }`}
            style={msg.role === 'user' ? { backgroundColor: color } : undefined}
          >
            {msg.content}
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="dp-typing">
            <div className="dp-typing-dot" />
            <div className="dp-typing-dot" />
            <div className="dp-typing-dot" />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="dp-input-area">
        <input
          ref={inputRef}
          className="dp-input"
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          maxLength={2000}
        />
        <button
          className="dp-send-btn"
          style={{ backgroundColor: color }}
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
        >
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>

      {/* Powered by */}
      <div className="dp-powered-by">
        Powered by <a href="https://dentalpilot.com" target="_blank" rel="noopener noreferrer">DentalPilot</a>
      </div>
    </div>
  )
}
