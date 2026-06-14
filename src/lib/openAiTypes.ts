import type { DeviceScreenTree, DeviceState, InstalledApp } from '../adapters/deviceTypes'
import type { ActionProtocol } from './actionProtocol'
import type { CustomToolDescriptor, SecretDescriptor } from './agentResources'
import type { ScreenSize } from './actionTypes'
import type { ActionToolSignature } from './toolRegistry'

export const REASONING_EFFORT_VALUES = [
  'none',
  'minimal',
  'low',
  'medium',
  'high',
  'xhigh',
] as const

export type ReasoningEffort = (typeof REASONING_EFFORT_VALUES)[number]

export function isReasoningEffort(value: unknown): value is ReasoningEffort {
  return (
    typeof value === 'string' &&
    REASONING_EFFORT_VALUES.includes(value as ReasoningEffort)
  )
}

export function isModelProvider(value: unknown): value is ModelProvider {
  return (
    typeof value === 'string' &&
    MODEL_PROVIDER_VALUES.includes(value as ModelProvider)
  )
}

export function isResponseFormat(value: unknown): value is ResponseFormat {
  return (
    typeof value === 'string' &&
    RESPONSE_FORMAT_VALUES.includes(value as ResponseFormat)
  )
}

export const RESPONSE_FORMAT_VALUES = ['none', 'json_object', 'json_schema', 'ollama_json'] as const
export type ResponseFormat = (typeof RESPONSE_FORMAT_VALUES)[number]

export const MODEL_PROVIDER_VALUES = [
  'openai',
  'groq',
  'together',
  'openrouter',
  'deepseek',
  'siliconflow',
  'glm',
  'mistral',
  'nvidia',
  'litellm',
  'lmstudio',
  'ollama',
  'llamacpp',
  'jan',
  'anthropic',
  'gemini',
  'custom',
] as const
export type ModelProvider = (typeof MODEL_PROVIDER_VALUES)[number]

export type ModelConfig = {
  provider?: ModelProvider
  baseUrl: string
  apiKey: string
  model: string
  reasoningEffort?: ReasoningEffort
  responseFormat?: ResponseFormat
  stream?: boolean
}

export type ProviderDefault = {
  baseUrl: string
  responseFormat: ResponseFormat
}

export const PROVIDER_DEFAULTS: Record<ModelProvider, ProviderDefault> = {
  openai: { baseUrl: 'https://api.openai.com/v1', responseFormat: 'json_object' },
  groq: { baseUrl: 'https://api.groq.com/openai/v1', responseFormat: 'json_object' },
  together: { baseUrl: 'https://api.together.xyz/v1', responseFormat: 'json_object' },
  openrouter: { baseUrl: 'https://openrouter.ai/api/v1', responseFormat: 'json_object' },
  deepseek: { baseUrl: 'https://api.deepseek.com', responseFormat: 'json_object' },
  siliconflow: { baseUrl: 'https://api.siliconflow.cn/v1', responseFormat: 'json_object' },
  glm: { baseUrl: 'https://open.bigmodel.cn/api/paas/v4', responseFormat: 'json_object' },
  mistral: { baseUrl: 'https://api.mistral.ai/v1', responseFormat: 'json_object' },
  nvidia: { baseUrl: 'https://integrate.api.nvidia.com/v1', responseFormat: 'json_object' },
  litellm: { baseUrl: '', responseFormat: 'json_object' },
  lmstudio: { baseUrl: 'http://localhost:1234/v1', responseFormat: 'json_schema' },
  ollama: { baseUrl: 'http://localhost:11434/v1', responseFormat: 'ollama_json' },
  llamacpp: { baseUrl: 'http://localhost:8080/v1', responseFormat: 'json_schema' },
  jan: { baseUrl: 'http://localhost:1337/v1', responseFormat: 'json_object' },
  anthropic: { baseUrl: '', responseFormat: 'none' },
  gemini: { baseUrl: '', responseFormat: 'none' },
  custom: { baseUrl: '', responseFormat: 'none' },
}

export type CompletionRequest = ModelConfig & {
  actionProtocol?: ActionProtocol
  task: string
  conversation?: readonly AgentConversationMessage[]
  screenshotDataUrl: string
  recalledScreenshots?: readonly PromptScreenshotAttachment[]
  screen: ScreenSize
  deviceScreen?: ScreenSize
  currentApp?: string
  deviceState?: DeviceState
  screenTree?: DeviceScreenTree
  history?: readonly AgentHistoryItem[]
  appCard?: string
  installedApps?: readonly InstalledApp[]
  memoryEnabled?: boolean
  memoryItems?: readonly string[]
  actionTools?: Record<string, ActionToolSignature>
  promptContext?: string
  customTools?: readonly CustomToolDescriptor[]
  secrets?: readonly SecretDescriptor[]
  unrestrictedMode?: boolean
  signal?: AbortSignal
}

export type PromptScreenshotAttachment = {
  label: string
  dataUrl: string
  screen: ScreenSize
  step?: number
  currentApp?: string
}

export type FinalResponseRequest = ModelConfig & {
  task: string
  conversation?: readonly AgentConversationMessage[]
  history?: readonly AgentHistoryItem[]
  currentApp?: string
  deviceState?: DeviceState
  progressSummary?: string
  signal?: AbortSignal
}

export type RepairActionRequest = CompletionRequest & {
  invalidOutput: string
  validationError: string
}

export type AgentHistoryItem = {
  step: number
  currentApp?: string
  actionPreview: string
  executionResult?: string
}

export type AgentConversationMessage = {
  id: string
  role: 'user' | 'assistant' | 'observation'
  content: string
}

export type UserContent =
  | string
  | Array<
      | {
          type: 'text'
          text: string
        }
      | {
          type: 'image_url'
          image_url: {
            url: string
          }
        }
    >

export type ChatMessage =
  | {
      role: 'system'
      content: string
    }
  | {
      role: 'assistant'
      content: string
    }
  | {
      role: 'user'
      content: UserContent
    }

export type ChatCompletionPayload = {
  model: string
  temperature?: number
  max_tokens: number
  reasoning_effort?: ReasoningEffort
  stream?: boolean
  response_format?:
    | { type: 'json_object' }
    | { type: 'json_schema'; json_schema: Record<string, unknown> }
  format?: 'json' // Ollama non-standard
  messages: ChatMessage[]
}

export type ConnectivityTestResult = {
  requestPayload: unknown
  responseStatus: number
  responseBody: unknown
}

export type OpenAiClient = {
  completeAction(request: CompletionRequest): Promise<string>
  completeFinalResponse?(request: FinalResponseRequest): Promise<string>
  repairAction?(request: RepairActionRequest): Promise<string>
  testConnectivity?(request: ModelConfig & { prompt: string; signal?: AbortSignal }): Promise<ConnectivityTestResult>
}
