import { useId, useState } from 'react'
import { Bot, Eye, EyeOff } from 'lucide-react'
import type { AppCopy } from '../lib/appCopy'
import type { ActionProtocol } from '../lib/actionProtocol'
import {
  MODEL_PROVIDER_VALUES,
  PROVIDER_DEFAULTS,
  type ModelConfig,
  type ModelProvider,
} from '../lib/openAiTypes'

export type ModelPanelProps = {
  actionProtocol: ActionProtocol
  copy: AppCopy
  modelConfig: ModelConfig
  onActionProtocolChange: (value: ActionProtocol) => void
  onFetchModels?: () => Promise<string[]>
  onModelConfigChange: <Key extends keyof ModelConfig>(key: Key, value: ModelConfig[Key]) => void
  onStreamResponsesChange: (value: boolean) => void
  onTestConnectivity: () => void
  streamResponses: boolean
}

export function ModelPanel({
  actionProtocol,
  copy,
  modelConfig,
  onActionProtocolChange,
  onFetchModels,
  onModelConfigChange,
  onStreamResponsesChange,
  onTestConnectivity,
  streamResponses,
}: ModelPanelProps) {
  const apiKeyInputId = useId()
  const modelListId = useId()
  const [fetchedModels, setFetchedModels] = useState<string[]>([])
  const [isFetchingModels, setIsFetchingModels] = useState(false)
  const [fetchError, setFetchError] = useState(false)
  const [apiKeyVisible, setApiKeyVisible] = useState(false)
  const apiKeyVisibilityLabel = apiKeyVisible ? copy.hideApiKey : copy.showApiKey

  const allSuggestedModels = Array.from(new Set(fetchedModels))

  return (
    <>
      <div className="panel-title">
        <Bot size={18} />
        <h2>{copy.model}</h2>
      </div>
      <div className="model-box">
        <div className="model-box-main">
          <div className="model-name-setting">
            <div className="model-name-field">
              <input
                aria-label={copy.model}
                value={modelConfig.model}
                onChange={(event) => onModelConfigChange('model', event.target.value)}
                placeholder="vision-model"
                autoComplete="off"
                list={modelListId}
              />
              <datalist id={modelListId}>
                {allSuggestedModels.map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
              {onFetchModels ? (
                <button
                  type="button"
                  className="secondary-button fetch-models-button"
                  disabled={isFetchingModels || !modelConfig.baseUrl || !modelConfig.apiKey}
                  onClick={async () => {
                    setIsFetchingModels(true)
                    setFetchError(false)
                    try {
                      const models = await onFetchModels()
                      setFetchedModels(models)
                      if (models.length === 0) {
                        setFetchError(true)
                      }
                    } catch (e) {
                      console.error(e)
                      setFetchError(true)
                    } finally {
                      setIsFetchingModels(false)
                    }
                  }}
                  title={fetchError ? copy.fetchModelsError : copy.fetchModels}
                >
                  {isFetchingModels ? copy.fetchingModels : copy.fetchModels}
                </button>
              ) : null}
            </div>
          </div>
          <div className="model-box-actions">
            <button
              type="button"
              className="secondary-button test-connectivity-button"
              onClick={onTestConnectivity}
              disabled={!modelConfig.baseUrl || !modelConfig.apiKey || !modelConfig.model}
            >
              {copy.testModel}
            </button>
          </div>
        </div>

        {fetchError && fetchedModels.length === 0 && (
          <span className="setting-error-hint">{copy.noModelsFound}</span>
        )}

        <details className="model-details">
          <summary>{copy.modelSettings}</summary>
          <label>
            {copy.provider}
            <select
              value={modelConfig.provider ?? 'custom'}
              onChange={(event) => {
                const provider = event.target.value as ModelProvider
                onModelConfigChange('provider', provider)
                const defaults = PROVIDER_DEFAULTS[provider]
                if (defaults) {
                  onModelConfigChange('baseUrl', defaults.baseUrl)
                  onModelConfigChange('responseFormat', defaults.responseFormat)
                }
              }}
            >
              {MODEL_PROVIDER_VALUES.map((provider) => (
                <option key={provider} value={provider}>
                  {copy.modelProviderNames[provider as keyof typeof copy.modelProviderNames] ||
                    provider}
                </option>
              ))}
            </select>
          </label>
          <label>
            {copy.baseUrl}
            <input
              value={modelConfig.baseUrl}
              onChange={(event) => onModelConfigChange('baseUrl', event.target.value)}
              placeholder="https://api.example.com/v1"
            />
          </label>
          <div className="api-key-setting">
            <label htmlFor={apiKeyInputId}>{copy.apiKey}</label>
            <div className="api-key-field">
              <input
                id={apiKeyInputId}
                value={modelConfig.apiKey}
                onChange={(event) => onModelConfigChange('apiKey', event.target.value)}
                placeholder="sk-..."
                type={apiKeyVisible ? 'text' : 'password'}
              />
              <button
                type="button"
                className="api-key-visibility-button"
                aria-label={apiKeyVisibilityLabel}
                title={apiKeyVisibilityLabel}
                onClick={() => setApiKeyVisible((current) => !current)}
              >
                {apiKeyVisible ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <label>
            {copy.reasoningEffort}
            <select
              value={modelConfig.reasoningEffort ?? ''}
              onChange={(event) =>
                onModelConfigChange(
                  'reasoningEffort',
                  event.target.value
                    ? (event.target.value as ModelConfig['reasoningEffort'])
                    : undefined,
                )
              }
            >
              <option value="">{copy.reasoningEffortDefault}</option>
              <option value="none">{copy.reasoningEffortNone}</option>
              <option value="minimal">{copy.reasoningEffortMinimal}</option>
              <option value="low">{copy.reasoningEffortLow}</option>
              <option value="medium">{copy.reasoningEffortMedium}</option>
              <option value="high">{copy.reasoningEffortHigh}</option>
              <option value="xhigh">{copy.reasoningEffortXHigh}</option>
            </select>
          </label>
          <label>
            {copy.actionProtocol}
            <select
              value={actionProtocol}
              onChange={(event) => onActionProtocolChange(event.target.value as ActionProtocol)}
            >
              <option value="webdroid_json">{copy.actionProtocolWebDroidJson}</option>
              <option value="open_autoglm_function">
                {copy.actionProtocolOpenAutoGlm}
              </option>
              <option value="mobilerun_xml">{copy.actionProtocolMobilerunXml}</option>
            </select>
          </label>
          <label>
            {copy.jsonResponseFormat}
            <select
              value={modelConfig.responseFormat ?? 'none'}
              onChange={(event) =>
                onModelConfigChange(
                  'responseFormat',
                  event.target.value as ModelConfig['responseFormat'],
                )
              }
            >
              <option value="none">{copy.responseFormatNone}</option>
              <option value="json_object">{copy.responseFormatJsonObject}</option>
              <option value="json_schema">{copy.responseFormatJsonSchema}</option>
              <option value="ollama_json">{copy.responseFormatOllamaJson}</option>
            </select>
          </label>
          <label className="toggle">
            <input
              type="checkbox"
              checked={streamResponses}
              onChange={(event) => onStreamResponsesChange(event.target.checked)}
            />
            <span>{copy.streamModelResponses}</span>
          </label>
        </details>
      </div>
    </>
  )
}
