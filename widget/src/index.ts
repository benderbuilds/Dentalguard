import React from 'react'
import ReactDOM from 'react-dom/client'
import { Widget } from './Widget'
import { getWidgetStyles } from './styles'

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

// Auto-initialize when the script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
