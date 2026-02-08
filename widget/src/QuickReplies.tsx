import React from 'react'

const QUICK_REPLIES = [
  'Book appointment',
  'Hours & location',
  'Insurance info',
]

interface QuickRepliesProps {
  onSelect: (text: string) => void
  primaryColor: string
}

export function QuickReplies({ onSelect, primaryColor }: QuickRepliesProps) {
  return (
    <div className="dp-quick-replies">
      {QUICK_REPLIES.map((text) => (
        <button
          key={text}
          className="dp-quick-reply"
          style={{ borderColor: primaryColor + '40', color: primaryColor }}
          onClick={() => onSelect(text)}
        >
          {text}
        </button>
      ))}
    </div>
  )
}
