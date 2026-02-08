import React, { useState, useEffect } from 'react'
import type { WidgetConfig } from './types'
import { fetchWidgetConfig } from './api'
import { ChatWindow } from './ChatWindow'

interface WidgetProps {
  embedKey: string
  apiBaseUrl: string
}

export function Widget({ embedKey, apiBaseUrl }: WidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<WidgetConfig | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const data = await fetchWidgetConfig(apiBaseUrl, embedKey)
        setConfig(data)
      } catch {
        setError(true)
      }
    }
    loadConfig()
  }, [apiBaseUrl, embedKey])

  if (error || !config) {
    // Don't render anything if config fails — silent failure
    return null
  }

  const color = config.primaryColor || '#2563eb'

  return (
    <>
      {isOpen && (
        <ChatWindow
          embedKey={embedKey}
          apiBaseUrl={apiBaseUrl}
          config={config}
          onClose={() => setIsOpen(false)}
        />
      )}

      <button
        className="dp-widget-button"
        style={{ backgroundColor: color }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
          </svg>
        )}
      </button>
    </>
  )
}
