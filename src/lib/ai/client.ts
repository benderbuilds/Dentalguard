import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface StreamChatOptions {
  systemPrompt: string
  messages: ChatMessage[]
  onToken: (token: string) => void
  onDone: (fullResponse: string) => void
  onError: (error: Error) => void
}

/**
 * Send a message to Claude and stream the response token by token.
 * Returns the full response text when complete.
 */
export async function streamChatResponse(opts: StreamChatOptions): Promise<string> {
  const { systemPrompt, messages, onToken, onDone, onError } = opts

  let fullResponse = ''

  try {
    const stream = anthropic.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    })

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        fullResponse += event.delta.text
        onToken(event.delta.text)
      }
    }

    onDone(fullResponse)
    return fullResponse
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    onError(error)
    throw error
  }
}

/**
 * Send a message to Claude and get the complete response (non-streaming).
 * Used for background tasks like intent classification.
 */
export async function getChatResponse(
  systemPrompt: string,
  messages: ChatMessage[]
): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  })

  const textBlock = response.content.find((block) => block.type === 'text')
  return textBlock?.text ?? ''
}
