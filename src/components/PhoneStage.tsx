import { Check, X } from 'lucide-react'
import { useState, type MouseEvent } from 'react'
import type { AgentAction } from '../lib/actions'
import { buildActionPreview } from '../lib/actions'
import type { AppCopy } from '../lib/appCopy'
import type { AgentStep } from '../lib/agent'
import { ScreenshotLightbox, type ScreenshotSource } from './ScreenshotLightbox'

export function PhoneStage({
  copy,
  displayedScreenshot,
  onRunInteractiveAction,
  pendingStep,
}: {
  copy: AppCopy
  displayedScreenshot: ScreenshotSource | null
  onRunInteractiveAction?: (action: AgentAction) => void
  pendingStep: AgentStep | null
}) {
  const [draftAction, setDraftAction] = useState<AgentAction | null>(null)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)
  const stageLabel = displayedScreenshot ? copy.androidScreenshot : copy.noScreenshot

  function pointerToScreenPoint(event: MouseEvent<HTMLElement>) {
    if (!displayedScreenshot) {
      return { x: 0, y: 0 }
    }

    const rect = event.currentTarget.getBoundingClientRect()
    const xRatio = rect.width > 0 ? (event.clientX - rect.left) / rect.width : 0
    const yRatio = rect.height > 0 ? (event.clientY - rect.top) / rect.height : 0
    return {
      x: Math.round(clamp(xRatio, 0, 1) * displayedScreenshot.screen.width),
      y: Math.round(clamp(yRatio, 0, 1) * displayedScreenshot.screen.height),
    }
  }

  function startInteraction(event: MouseEvent<HTMLElement>) {
    event.preventDefault()
    event.stopPropagation()
    setDragStart(pointerToScreenPoint(event))
  }

  function finishInteraction(event: MouseEvent<HTMLElement>) {
    event.preventDefault()
    event.stopPropagation()
    if (!dragStart) {
      return
    }

    const end = pointerToScreenPoint(event)
    const distance = Math.hypot(end.x - dragStart.x, end.y - dragStart.y)
    setDraftAction(
      distance > 24
        ? {
            action: 'swipe',
            fromX: dragStart.x,
            fromY: dragStart.y,
            toX: end.x,
            toY: end.y,
            durationMs: 400,
          }
        : {
            action: 'tap',
            x: dragStart.x,
            y: dragStart.y,
          },
    )
    setDragStart(null)
  }

  return (
    <section className="phone-stage" aria-label={stageLabel}>
      {displayedScreenshot ? (
        <div className="phone-frame">
          <ScreenshotLightbox
            screenshot={displayedScreenshot}
            title={copy.androidScreenshot}
            thumbnailAlt={copy.androidScreenshot}
            expandedAlt={copy.expandedAndroidScreenshot}
            openButtonLabel={copy.openScreenshotFor(copy.androidScreenshot)}
            dialogLabel={copy.screenshotDialogFor(copy.androidScreenshot)}
            closeLabel={copy.closeScreenshotPreview}
            thumbnailClassName="phone-screenshot-button"
          >
            {pendingStep ? (
              <ActionOverlay action={pendingStep.action} screen={displayedScreenshot.screen} />
            ) : null}
            {draftAction ? (
              <ActionOverlay action={draftAction} screen={displayedScreenshot.screen} />
            ) : null}
            {onRunInteractiveAction ? (
              <span
                aria-label={copy.screenshotInteractionLayer}
                className="screenshot-command-layer"
                role="presentation"
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                }}
                onMouseDown={startInteraction}
                onMouseLeave={() => setDragStart(null)}
                onMouseUp={finishInteraction}
              />
            ) : null}
          </ScreenshotLightbox>
          {draftAction ? (
            <div className="screenshot-command-draft">
              <span>{previewInteractiveAction(draftAction)}</span>
              <button
                type="button"
                aria-label={copy.runGeneratedAction}
                onClick={() => onRunInteractiveAction?.(draftAction)}
              >
                <Check size={14} />
                {copy.execute}
              </button>
              <button
                type="button"
                aria-label={copy.clearGeneratedAction}
                onClick={() => setDraftAction(null)}
              >
                <X size={14} />
                {copy.clear}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}

function previewInteractiveAction(action: AgentAction) {
  if (action.action === 'swipe') {
    return `swipe (${action.fromX}, ${action.fromY}) -> (${action.toX}, ${action.toY})`
  }
  return buildActionPreview(action)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function ActionOverlay({
  action,
  screen,
}: {
  action: AgentAction
  screen: { width: number; height: number }
}) {
  if (action.action === 'tap' || action.action === 'long_press' || action.action === 'double_tap') {
    return (
      <span
        className={`tap-marker ${action.action}`}
        style={{
          left: `${(action.x / screen.width) * 100}%`,
          top: `${(action.y / screen.height) * 100}%`,
        }}
      />
    )
  }

  if (action.action === 'swipe') {
    return (
      <>
        <span
          className="swipe-marker start"
          style={{
            left: `${(action.fromX / screen.width) * 100}%`,
            top: `${(action.fromY / screen.height) * 100}%`,
          }}
        />
        <span
          className="swipe-marker end"
          style={{
            left: `${(action.toX / screen.width) * 100}%`,
            top: `${(action.toY / screen.height) * 100}%`,
          }}
        />
      </>
    )
  }

  return null
}
