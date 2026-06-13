import { describe, expect, it } from 'vitest'
import { extractAssistantText, formatApiError } from './openAiResponse'

describe('extractAssistantText', () => {
  it('reads assistant content from a chat completion response', () => {
    expect(
      extractAssistantText({
        choices: [{ message: { content: '{"action":"done"}' } }],
      }),
    ).toBe('{"action":"done"}')
  })

  it('rejects empty completion responses', () => {
    expect(() => extractAssistantText({ choices: [] })).toThrow('No assistant content')
  })
})

describe('formatApiError', () => {
  it('extracts error from body.error.message', () => {
    expect(formatApiError(400, { error: { message: 'Too many tokens' } })).toBe(
      'Model API failed with 400: Too many tokens',
    )
  })

  it('extracts error from body.message', () => {
    expect(formatApiError(400, { message: 'Invalid model' })).toBe(
      'Model API failed with 400: Invalid model',
    )
  })

  it('extracts error from body.error string', () => {
    expect(formatApiError(401, { error: 'Unauthorized' })).toBe(
      'Model API failed with 401: Unauthorized',
    )
  })

  it('handles plain text bodies', () => {
    expect(formatApiError(502, 'Gateway Timeout')).toBe(
      'Model API failed with 502: Gateway Timeout',
    )
  })

  it('falls back to status only for unknown structures', () => {
    expect(formatApiError(500, { foo: 'bar' })).toBe('Model API failed with 500.')
  })
})
