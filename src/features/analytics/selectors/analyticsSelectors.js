import { TASK_STATUSES } from '../../tasks/taskModel';

export function selectCompletedTaskCount(tasks) {
  return tasks.filter((task) => task.status === TASK_STATUSES.COMPLETED).length;
}

export function selectTotalTaskCount(tasks) {
  return tasks.length;
}

export function selectCompletionRate(tasks) {
  const totalTasks = selectTotalTaskCount(tasks);

  if (totalTasks === 0) {
    return 0;
  }

  return selectCompletedTaskCount(tasks) / totalTasks;
}

export function selectTotalFocusSeconds(sessions) {
  return sessions.reduce(
    (total, session) => total + (session.durationSeconds ?? 0),
    0
  );
}

export function selectFocusSessionCount(sessions) {
  return sessions.length;
}

function toLocalDateKey(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatDayLabel(date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
  }).format(date);
}

export function selectRecentFocusActivity(
  sessions,
  { days = 7, now = new Date() } = {}
) {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (days - index - 1));

    const dateKey = toLocalDateKey(date);

    const daySessions = sessions.filter((session) => {
      const completedAt = new Date(session.completedAt);

      return toLocalDateKey(completedAt) === dateKey;
    });

    return {
      date: dateKey,
      label: formatDayLabel(date),
      focusMinutes: Math.round(
        daySessions.reduce(
          (total, session) => total + (session.durationSeconds ?? 0),
          0
        ) / 60
      ),
      sessions: daySessions.length,
    };
  });
}

export function selectRecentProductivity(activity) {
  return {
    focusMinutes: activity.reduce((total, day) => total + day.focusMinutes, 0),
    sessions: activity.reduce((total, day) => total + day.sessions, 0),
  };
}
