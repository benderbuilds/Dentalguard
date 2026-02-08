import React, { useState, useRef, useEffect, useCallback } from 'react'
import type { Message, WidgetConfig } from './types'
import { sendChatMessage, getSessionId } from './api'
import { MessageBubble } from './MessageBubble'
import { QuickReplies } from './QuickReplies'
import { TypingIndicator } from './TypingIndicator'

interface ChatWindowProps {
  embedKey: string
  apiBaseUrl: string
  config: WidgetConfig
  onClose: () => void
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
  const [showQuickReplies, setShowQuickReplies] = useState(true)
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

  const handleSend = async (text?: string) => {
    const messageText = (text ?? input).trim()
    if (!messageText || isLoading) return

    setShowQuickReplies(false)
    setInput('')
    setIsLoading(true)

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText,
    }
    setMessages((prev) => [...prev, userMessage])

    const assistantId = `assistant-${Date.now()}`
    let assistantAdded = false

    try {
      await sendChatMessage(
        apiBaseUrl,
        embedKey,
        sessionId.current,
        messageText,
        // onToken
        (token) => {
          if (!assistantAdded) {
            assistantAdded = true
            setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: token }])
          } else {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, content: m.content + token } : m
              )
            )
          }
        },
        // onDone
        () => {
          // Response complete
        },
        // onError
        (errorMessage) => {
          if (!assistantAdded) {
            setMessages((prev) => [
              ...prev,
              { id: assistantId, role: 'assistant', content: errorMessage },
            ])
          } else {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId && !m.content ? { ...m, content: errorMessage } : m
              )
            )
          }
        }
      )
    } catch {
      if (!assistantAdded) {
        setMessages((prev) => [
          ...prev,
          {
            id: assistantId,
            role: 'assistant',
            content:
              "I'm sorry, I'm having trouble connecting right now. Please try again or call the office directly.",
          },
        ])
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const color = config.primaryColor || '#2563eb'
  const showTyping = isLoading && !messages.some((m) => m.id.startsWith('assistant-') && m.content === '')

  return (
    <div className="dp-chat-window">
      {/* Header */}
      <div className="dp-chat-header" style={{ backgroundColor: color }}>
        <div className="dp-chat-header-info">
          <div className="dp-chat-header-avatar">
            {config.logoUrl ? (
              <img
                src={config.logoUrl}
                alt=""
                onError={(e) => {
                  const el = e.target as HTMLImageElement
                  el.style.display = 'none'
                  if (el.parentElement) {
                    const span = document.createElement('span')
                    span.className = 'dp-chat-header-avatar-letter'
                    span.textContent = config.botName.charAt(0).toUpperCase()
                    el.parentElement.appendChild(span)
                  }
                }}
              />
            ) : (
              <span className="dp-chat-header-avatar-letter">
                {config.botName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <div className="dp-chat-header-name">{config.botName}</div>
            <div className="dp-chat-header-status">{config.practiceName}</div>
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
          <MessageBubble key={msg.id} message={msg} primaryColor={color} />
        ))}

        {showQuickReplies && messages.length === 1 && (
          <QuickReplies
            onSelect={(text) => handleSend(text)}
            primaryColor={color}
          />
        )}

        {showTyping && <TypingIndicator />}

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
          onClick={() => handleSend()}
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
        Powered by{' '}
        <a href="https://dentalpilot.com" target="_blank" rel="noopener noreferrer">
          DentalPilot
        </a>
      </div>
    </div>
  )
}
