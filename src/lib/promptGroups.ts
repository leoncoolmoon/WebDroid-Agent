export interface PromptGroup {
  id: string
  name: string
  systemPrompt: string
}

export const DEFAULT_PROMPT_GROUP_ID = 'default'
const PROMPT_GROUPS_KEY = 'webdroid-prompt-groups'

export function loadPromptGroups(): PromptGroup[] {
  const raw = localStorage.getItem(PROMPT_GROUPS_KEY)
  if (raw) {
    try {
      return JSON.parse(raw)
    } catch {
      return []
    }
  }
  return []
}

export function savePromptGroups(groups: PromptGroup[]) {
  localStorage.setItem(PROMPT_GROUPS_KEY, JSON.stringify(groups))
}

export function serializePromptGroups(groups: PromptGroup[]): string {
  return JSON.stringify(groups, null, 2)
}

export function serializePromptGroup(group: PromptGroup): string {
  return JSON.stringify(group, null, 2)
}

export function parsePromptGroupsJson(json: string): PromptGroup[] {
  const parsed = JSON.parse(json)
  if (!Array.isArray(parsed)) {
    // If it's a single object, wrap it in an array
    if (typeof parsed === 'object' && parsed !== null && 'systemPrompt' in parsed) {
      return [validatePromptGroup(parsed)]
    }
    throw new Error('Invalid JSON: expected an array or a single prompt group.')
  }
  return parsed.map(validatePromptGroup)
}

function validatePromptGroup(item: unknown): PromptGroup {
  if (
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    'name' in item &&
    'systemPrompt' in item &&
    typeof (item as { id: unknown }).id === 'string' &&
    typeof (item as { name: unknown }).name === 'string' &&
    typeof (item as { systemPrompt: unknown }).systemPrompt === 'string'
  ) {
    return item as unknown as PromptGroup
  }
  throw new Error('Invalid prompt group format.')
}
