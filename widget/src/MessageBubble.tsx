import React from 'react'
import type { Message } from './types'

interface MessageBubbleProps {
  message: Message
  primaryColor: string
}

export function MessageBubble({ message, primaryColor }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={`dp-message ${isUser ? 'dp-message-user' : 'dp-message-assistant'}`}
      style={isUser ? { backgroundColor: primaryColor } : undefined}
    >
      {message.content}
    </div>
  )
}
