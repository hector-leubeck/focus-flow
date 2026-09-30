import { describe, expect, it } from 'vitest';
import {
  selectCompletedTaskCount,
  selectCompletionRate,
  selectRecentFocusActivity,
  selectRecentProductivity,
  selectTotalFocusSeconds,
} from './analyticsSelectors';

describe('analytics selectors', () => {
  it('calculates task totals and completion rate', () => {
    const tasks = [
      { id: 'one', status: 'completed' },
      { id: 'two', status: 'backlog' },
      { id: 'three', status: 'completed' },
      { id: 'four', status: 'in-progress' },
    ];

    expect(selectCompletedTaskCount(tasks)).toBe(2);
    expect(selectCompletionRate(tasks)).toBe(0.5);
  });

  it('returns zero completion rate when there are no tasks', () => {
    expect(selectCompletionRate([])).toBe(0);
  });

  it('sums focus duration and groups recent sessions by local calendar day', () => {
    const sessions = [
      {
        durationSeconds: 1500,
        completedAt: new Date(2026, 8, 22, 10, 0, 0).toISOString(),
      },
      {
        durationSeconds: 900,
        completedAt: new Date(2026, 8, 22, 15, 0, 0).toISOString(),
      },
      {
        durationSeconds: 1200,
        completedAt: new Date(2026, 8, 18, 9, 0, 0).toISOString(),
      },
    ];

    const activity = selectRecentFocusActivity(sessions, {
      days: 7,
      now: new Date(2026, 8, 23, 12, 0, 0),
    });

    expect(selectTotalFocusSeconds(sessions)).toBe(3600);

    expect(activity).toContainEqual({
      date: '2026-09-22',
      label: 'Tue',
      focusMinutes: 40,
      sessions: 2,
    });

    expect(selectRecentProductivity(activity)).toEqual({
      focusMinutes: 60,
      sessions: 3,
    });
  });

  it('returns empty recent activity when there are no sessions', () => {
    const activity = selectRecentFocusActivity([], {
      days: 7,
      now: new Date('2026-09-23T12:00:00.000Z'),
    });

    expect(activity).toHaveLength(7);
    expect(selectRecentProductivity(activity)).toEqual({
      focusMinutes: 0,
      sessions: 0,
    });
  });
});
