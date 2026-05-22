// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { APP_COPY } from '../lib/appCopy'
import { PhoneStage } from './PhoneStage'

afterEach(() => {
  cleanup()
})

describe('PhoneStage', () => {
  it('creates a tap action from a screenshot click', () => {
    const onRunInteractiveAction = vi.fn()
    render(
      <PhoneStage
        copy={APP_COPY['en-US']}
        displayedScreenshot={{
          dataUrl: 'data:image/png;base64,abc123',
          screen: { width: 1080, height: 2400 },
        }}
        onRunInteractiveAction={onRunInteractiveAction}
        pendingStep={null}
      />,
    )

    const layer = screen.getByLabelText('Screenshot interaction layer')
    vi.spyOn(layer, 'getBoundingClientRect').mockReturnValue({
      bottom: 620,
      height: 600,
      left: 10,
      right: 280,
      top: 20,
      width: 270,
      x: 10,
      y: 20,
      toJSON: () => ({}),
    })

    fireEvent.mouseDown(layer, { clientX: 145, clientY: 320 })
    fireEvent.mouseUp(layer, { clientX: 145, clientY: 320 })

    expect(screen.getByText('tap (540, 1200)')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Run generated action' }))

    expect(onRunInteractiveAction).toHaveBeenCalledWith({ action: 'tap', x: 540, y: 1200 })
  })

  it('creates a swipe action from a screenshot drag', () => {
    const onRunInteractiveAction = vi.fn()
    render(
      <PhoneStage
        copy={APP_COPY['en-US']}
        displayedScreenshot={{
          dataUrl: 'data:image/png;base64,abc123',
          screen: { width: 1080, height: 2400 },
        }}
        onRunInteractiveAction={onRunInteractiveAction}
        pendingStep={null}
      />,
    )

    const layer = screen.getByLabelText('Screenshot interaction layer')
    vi.spyOn(layer, 'getBoundingClientRect').mockReturnValue({
      bottom: 620,
      height: 600,
      left: 10,
      right: 280,
      top: 20,
      width: 270,
      x: 10,
      y: 20,
      toJSON: () => ({}),
    })

    fireEvent.mouseDown(layer, { clientX: 145, clientY: 520 })
    fireEvent.mouseUp(layer, { clientX: 145, clientY: 220 })

    expect(screen.getByText('swipe (540, 2000) -> (540, 800)')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Run generated action' }))

    expect(onRunInteractiveAction).toHaveBeenCalledWith({
      action: 'swipe',
      durationMs: 400,
      fromX: 540,
      fromY: 2000,
      toX: 540,
      toY: 800,
    })
  })
})
