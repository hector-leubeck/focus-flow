import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useFocusTimerStore } from '../store/focusTimerStore';
import { DEFAULT_FOCUS_DURATION_SECONDS, TIMER_STATUSES } from '../timerConfig';
import FocusTimer from './FocusTimer';

describe('FocusTimer user flows', () => {
  beforeEach(() => {
    localStorage.clear();
    useFocusTimerStore.setState({
      status: TIMER_STATUSES.IDLE,
      durationSeconds: DEFAULT_FOCUS_DURATION_SECONDS,
      elapsedSeconds: 0,
      remainingSeconds: DEFAULT_FOCUS_DURATION_SECONDS,
      startedAt: null,
      sessions: [],
    });
    afterEach(() => {
      vi.useRealTimers();
    });
  });

  it('supports start, pause, resume, complete, and reset', async () => {
    const user = userEvent.setup();

    render(<FocusTimer />);
    await user.click(screen.getByRole('button', { name: 'Start focus' }));
    expect(screen.getByText('Focus in progress')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Pause' }));
    expect(screen.getByText('Focus paused')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Resume' }));
    expect(screen.getByText('Focus in progress')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Complete' }));
    expect(screen.getByText('Session complete')).toBeInTheDocument();
    expect(screen.getByText('1 session logged')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByText('Ready to focus')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Start focus' })
    ).toBeInTheDocument();
  });

  it('automatically completes a focus session when time reaches zero', () => {
    vi.useFakeTimers();

    vi.setSystemTime(new Date('2026-09-23T12:00:00'));

    useFocusTimerStore.setState({
      status: TIMER_STATUSES.IDLE,
      durationSeconds: 2,
      elapsedSeconds: 0,
      remainingSeconds: 2,
      startedAt: null,
      sessions: [],
    });

    render(<FocusTimer />);

    act(() => {
      useFocusTimerStore.getState().start(Date.now());
    });

    act(() => {
      vi.advanceTimersByTime(2500);
    });

    expect(screen.getByText('Session complete')).toBeInTheDocument();

    expect(useFocusTimerStore.getState().sessions).toHaveLength(1);

    expect(useFocusTimerStore.getState().remainingSeconds).toBe(0);
  });
});
