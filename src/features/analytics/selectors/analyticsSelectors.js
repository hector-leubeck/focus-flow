import { TASK_STATUSES } from "../../tasks/taskModel";

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

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
    0,
  );
}

export function selectFocusSessionCount(sessions) {
  return sessions.length;
}

function toDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function formatDayLabel(date) {
  return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
}

export function selectRecentFocusActivity(
  sessions,
  { days = 7, now = new Date() } = {},
) {
  const today = new Date(now);
  today.setUTCHours(0, 0, 0, 0);

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(
      today.getTime() - (days - index - 1) * DAY_IN_MILLISECONDS,
    );
    const dateKey = toDateKey(date);
    const daySessions = sessions.filter((session) =>
      session.completedAt?.startsWith(dateKey),
    );

    return {
      date: dateKey,
      label: formatDayLabel(date),
      focusMinutes: Math.round(
        daySessions.reduce(
          (total, session) => total + (session.durationSeconds ?? 0),
          0,
        ) / 60,
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
