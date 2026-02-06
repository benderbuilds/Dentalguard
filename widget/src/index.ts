import React from 'react'
import ReactDOM from 'react-dom/client'
import { Widget } from './Widget'

function init() {
  // Find the script tag to get the embed key and API base URL
  const script = document.currentScript as HTMLScriptElement
    ?? document.querySelector('script[data-key]')

  if (!script) {
    console.error('[DentalPilot] Widget script tag not found')
    return
  }

  const embedKey = script.getAttribute('data-key')
  if (!embedKey) {
    console.error('[DentalPilot] Missing data-key attribute on script tag')
    return
  }

  // Derive API base URL from the script src
  const scriptSrc = script.getAttribute('src') ?? ''
  const apiBaseUrl = scriptSrc
    ? new URL(scriptSrc).origin
    : window.location.origin

  // Create a container for the widget using Shadow DOM for style isolation
  const container = document.createElement('div')
  container.id = 'dentalpilot-widget-root'
  document.body.appendChild(container)

  const shadow = container.attachShadow({ mode: 'open' })
  const mountPoint = document.createElement('div')
  shadow.appendChild(mountPoint)

  // Inject styles into shadow DOM
  const styleEl = document.createElement('style')
  styleEl.textContent = getWidgetStyles()
  shadow.appendChild(styleEl)

  const root = ReactDOM.createRoot(mountPoint)
  root.render(
    React.createElement(Widget, { embedKey, apiBaseUrl })
  )
}

function getWidgetStyles(): string {
  return `
    * { box-sizing: border-box; margin: 0; padding: 0; }

    .dp-widget-button {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: transform 0.2s, box-shadow 0.2s;
      z-index: 999998;
    }
    .dp-widget-button:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(0,0,0,0.2);
    }
    .dp-widget-button svg {
      width: 28px;
      height: 28px;
      fill: white;
    }

    .dp-chat-window {
      position: fixed;
      bottom: 96px;
      right: 24px;
      width: 380px;
      height: 520px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    @media (max-width: 480px) {
      .dp-chat-window {
        width: calc(100vw - 16px);
        height: calc(100vh - 120px);
        right: 8px;
        bottom: 88px;
      }
    }

    .dp-chat-header {
      padding: 16px;
      color: white;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .dp-chat-header-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .dp-chat-header-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
    }
    .dp-chat-header-name {
      font-weight: 600;
      font-size: 15px;
    }
    .dp-chat-header-status {
      font-size: 12px;
      opacity: 0.85;
    }
    .dp-chat-close {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 4px;
      opacity: 0.8;
    }
    .dp-chat-close:hover { opacity: 1; }

    .dp-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .dp-message {
      max-width: 85%;
      padding: 10px 14px;
      border-radius: 16px;
      font-size: 14px;
      line-height: 1.4;
      word-wrap: break-word;
    }
    .dp-message-user {
      align-self: flex-end;
      color: white;
      border-bottom-right-radius: 4px;
    }
    .dp-message-assistant {
      align-self: flex-start;
      background: #f1f3f5;
      color: #1a1a1a;
      border-bottom-left-radius: 4px;
    }

    .dp-typing {
      align-self: flex-start;
      display: flex;
      gap: 4px;
      padding: 12px 16px;
      background: #f1f3f5;
      border-radius: 16px;
    }
    .dp-typing-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #999;
      animation: dp-bounce 1.4s infinite ease-in-out;
    }
    .dp-typing-dot:nth-child(1) { animation-delay: 0s; }
    .dp-typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .dp-typing-dot:nth-child(3) { animation-delay: 0.4s; }

    @keyframes dp-bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }

    .dp-input-area {
      padding: 12px 16px;
      border-top: 1px solid #eee;
      display: flex;
      gap: 8px;
    }
    .dp-input {
      flex: 1;
      border: 1px solid #ddd;
      border-radius: 24px;
      padding: 10px 16px;
      font-size: 14px;
      outline: none;
      font-family: inherit;
    }
    .dp-input:focus {
      border-color: #999;
    }
    .dp-send-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .dp-send-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .dp-send-btn svg {
      width: 18px;
      height: 18px;
      fill: white;
    }

    .dp-powered-by {
      text-align: center;
      padding: 6px;
      font-size: 11px;
      color: #999;
    }
    .dp-powered-by a {
      color: #666;
      text-decoration: none;
    }
    .dp-powered-by a:hover { text-decoration: underline; }
  `
}

// Auto-initialize when the script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
