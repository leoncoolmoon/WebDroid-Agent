import {
  Check,
  CircleStop,
  Download,
  Loader2,
  MessageSquare,
  Plus,
  Play,
  RotateCcw,
  Send,
  StepForward,
} from 'lucide-react'
import { buildActionPreview, type AgentAction } from '../lib/actions'
import type { AppCopy } from '../lib/appCopy'
import type { AgentStep } from '../lib/agent'
import type { AgentConversationMessage } from '../lib/openAiClient'
import type { TaskTemplate } from '../lib/taskTemplates'

export function RunPanel({
  autoExecute,
  busy,
  canRun,
  chatInput,
  conversation,
  copy,
  logsCount,
  maxSteps,
  onAutoExecuteChange,
  onChatInputChange,
  onExecutePendingStep,
  onExportRunLog,
  onMaxStepsChange,
  onPlanNextStep,
  onResetSession,
  onRunAutoLoop,
  onStartNewChat,
  onStopRun,
  onSubmitChatMessage,
  onTaskTemplateSelect,
  pendingStep,
  taskTemplates,
}: {
  autoExecute: boolean
  busy: string | null
  canRun: boolean
  chatInput: string
  conversation: AgentConversationMessage[]
  copy: AppCopy
  logsCount: number
  maxSteps: number
  onAutoExecuteChange: (value: boolean) => void
  onChatInputChange: (value: string) => void
  onExecutePendingStep: () => void
  onExportRunLog: () => void
  onMaxStepsChange: (value: number) => void
  onPlanNextStep: () => void
  onResetSession: () => void
  onRunAutoLoop: () => void
  onStartNewChat: () => void
  onStopRun: () => void
  onSubmitChatMessage: () => void
  onTaskTemplateSelect: (prompt: string) => void
  pendingStep: AgentStep | null
  taskTemplates: TaskTemplate[]
}) {
  return (
    <>
      <div className="panel-title">
        <MessageSquare size={18} />
        <h2>{copy.chat}</h2>
      </div>
      <details className="compact-section">
        <summary>{copy.conversation}</summary>
        <div className="conversation-list" aria-label={copy.conversation}>
          {conversation.length === 0 ? <p className="muted">{copy.noMessages}</p> : null}
          {conversation.map((message) => (
            <article className={`chat-message ${message.role}`} key={message.id}>
              <span>{formatConversationRole(message.role, copy)}</span>
              <p>{message.content}</p>
            </article>
          ))}
        </div>
      </details>
      <label>
        {copy.chatMessage}
        <textarea
          value={chatInput}
          onChange={(event) => onChatInputChange(event.target.value)}
          rows={4}
          placeholder={copy.chatPlaceholder}
        />
      </label>
      <label>
        {copy.taskTemplate}
        <select
          value=""
          onChange={(event) => {
            const template = taskTemplates.find((candidate) => candidate.id === event.target.value)
            if (template) {
              onTaskTemplateSelect(template.prompt)
            }
          }}
          disabled={Boolean(busy)}
        >
          <option value="">{copy.chooseTaskTemplate}</option>
          {taskTemplates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.title}
            </option>
          ))}
        </select>
      </label>
      <div className="button-row">
        <button type="button" onClick={onSubmitChatMessage} disabled={!chatInput.trim()}>
          <Send size={16} />
          {copy.send}
        </button>
        <button type="button" onClick={onStartNewChat} disabled={Boolean(busy)}>
          <Plus size={16} />
          {copy.newChat}
        </button>
      </div>
      <div className="button-row">
        <button type="button" onClick={onPlanNextStep} disabled={!canRun || autoExecute}>
          <StepForward size={16} />
          {copy.plan}
        </button>
        <button type="button" onClick={onRunAutoLoop} disabled={!canRun || !autoExecute}>
          {busy === 'Run agent' ? <Loader2 className="spin" size={16} /> : <Play size={16} />}
          {copy.run}
        </button>
      </div>
      <details className="compact-section">
        <summary>{copy.runOptions}</summary>
        <div className="run-options-panel">
          <label>
            {copy.maxSteps}
            <input
              type="number"
              min={1}
              max={200}
              value={maxSteps}
              onChange={(event) => onMaxStepsChange(Number(event.target.value))}
            />
          </label>
          <label className="toggle">
            <input
              type="checkbox"
              checked={autoExecute}
              onChange={(event) => onAutoExecuteChange(event.target.checked)}
            />
            <span>{copy.autoExecute}</span>
          </label>
          <button type="button" className="wide danger" onClick={onStopRun} disabled={!busy}>
            <CircleStop size={16} />
            {copy.stop}
          </button>
          <div className="button-row">
            <button type="button" onClick={onResetSession} disabled={Boolean(busy)}>
              <RotateCcw size={16} />
              {copy.reset}
            </button>
            <button type="button" onClick={onExportRunLog} disabled={logsCount === 0}>
              <Download size={16} />
              {copy.export}
            </button>
          </div>
        </div>
      </details>

      <div className="pending-action">
        <div className="pending-header">
          <span>{copy.pendingAction}</span>
          {pendingStep ? <small>{copy.step} {pendingStep.index}</small> : null}
        </div>
        <p>{pendingStep ? buildActionPreview(pendingStep.action) : copy.none}</p>
        <button
          type="button"
          className="wide primary"
          onClick={onExecutePendingStep}
          disabled={!pendingStep || Boolean(busy)}
        >
          <Check size={16} />
          {pendingActionLabel(pendingStep?.action.action, copy)}
        </button>
      </div>
    </>
  )
}

function formatConversationRole(role: 'user' | 'assistant' | 'observation', copy: AppCopy) {
  if (role === 'assistant') {
    return copy.assistant
  }
  if (role === 'observation') {
    return copy.observation
  }
  return copy.user
}

function pendingActionLabel(action: AgentAction['action'] | undefined, copy: AppCopy) {
  if (
    action === 'take_over' ||
    action === 'note' ||
    action === 'interact' ||
    action === 'call_api'
  ) {
    return copy.acknowledge
  }
  if (action === 'done') {
    return copy.finish
  }
  return copy.execute
}
