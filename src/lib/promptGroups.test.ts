import { describe, expect, it } from 'vitest'
import {
  parsePromptGroupsJson,
  serializePromptGroup,
  serializePromptGroups,
  type PromptGroup,
} from './promptGroups'

describe('promptGroups', () => {
  const mockGroup: PromptGroup = {
    id: '1',
    name: 'Test',
    systemPrompt: 'Hello',
  }

  it('serializes and parses a single group', () => {
    const json = serializePromptGroup(mockGroup)
    const parsed = parsePromptGroupsJson(json)
    expect(parsed).toEqual([mockGroup])
  })

  it('serializes and parses multiple groups', () => {
    const groups = [mockGroup, { ...mockGroup, id: '2', name: 'Other' }]
    const json = serializePromptGroups(groups)
    const parsed = parsePromptGroupsJson(json)
    expect(parsed).toEqual(groups)
  })

  it('throws on invalid json', () => {
    expect(() => parsePromptGroupsJson('invalid')).toThrow()
    expect(() => parsePromptGroupsJson('{}')).toThrow('Invalid JSON')
    expect(parsePromptGroupsJson('[]')).toEqual([])
  })

  it('validates required fields', () => {
    const invalid = JSON.stringify({ id: '1', name: 'Test' }) // missing systemPrompt
    expect(() => parsePromptGroupsJson(invalid)).toThrow('Invalid JSON: expected an array')
  })
})
