import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Card from "../../../shared/components/Card";
import SectionHeader from "../../../shared/components/SectionHeader";
import { useFocusTimerStore } from "../../focus-timer/store/focusTimerStore";
import { useTasksStore } from "../../tasks/store/tasksStore";
import {
  selectCompletedTaskCount,
  selectCompletionRate,
  selectFocusSessionCount,
  selectRecentFocusActivity,
  selectRecentProductivity,
  selectTotalFocusSeconds,
  selectTotalTaskCount,
} from "../selectors/analyticsSelectors";
import {
  formatFocusDuration,
  formatPercentage,
} from "../utils/analyticsFormatters";
import "./AnalyticsPanel.css";

function Metric({ label, value, detail }) {
  return (
    <div className="analytics-metric">
      <span>{label}</span>
      <strong>{value}</strong>
      {detail ? <small>{detail}</small> : null}
    </div>
  );
}

function AnalyticsPanel() {
  const tasks = useTasksStore((state) => state.tasks);
  const sessions = useFocusTimerStore((state) => state.sessions);
  const recentActivity = selectRecentFocusActivity(sessions);
  const recentProductivity = selectRecentProductivity(recentActivity);
  const completedTasks = selectCompletedTaskCount(tasks);
  const totalTasks = selectTotalTaskCount(tasks);
  const totalFocusSeconds = selectTotalFocusSeconds(sessions);
  const hasRecentActivity = recentProductivity.sessions > 0;

  return (
    <Card
      as="section"
      className="analytics-panel"
      id="analytics"
      aria-label="Analytics"
    >
      <SectionHeader
        className="analytics-panel-header"
        eyebrow="03 / Reflect"
        title="Analytics"
        description="A measured view of the work already done."
      />

      <div className="analytics-metrics">
        <Metric
          label="Tasks completed"
          value={completedTasks}
          detail={`of ${totalTasks} total`}
        />
        <Metric
          label="Completion rate"
          value={formatPercentage(selectCompletionRate(tasks))}
        />
        <Metric
          label="Total focus time"
          value={formatFocusDuration(totalFocusSeconds)}
        />
        <Metric
          label="Focus sessions"
          value={selectFocusSessionCount(sessions)}
        />
        <Metric
          label="Recent productivity"
          value={
            hasRecentActivity
              ? `${recentProductivity.focusMinutes}m`
              : "No data"
          }
          detail="last 7 days"
        />
      </div>

      <div className="analytics-chart-section">
        <div className="analytics-chart-heading">
          <div>
            <h3>Focus activity</h3>
            <p>Minutes completed over the last 7 days.</p>
          </div>
          {hasRecentActivity ? (
            <span>{recentProductivity.sessions} sessions</span>
          ) : null}
        </div>
        {hasRecentActivity ? (
          <div className="analytics-chart" aria-label="Focus activity chart">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={recentActivity}
                margin={{ top: 10, right: 4, left: -24, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="var(--color-border)"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--color-muted)", fontSize: 10 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--color-muted)", fontSize: 10 }}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(104, 185, 167, 0.1)" }}
                  contentStyle={{
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    background: "var(--color-surface)",
                    fontSize: "11px",
                  }}
                  formatter={(value) => [`${value} min`, "Focus"]}
                />
                <Bar
                  dataKey="focusMinutes"
                  fill="var(--color-teal)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="analytics-empty" role="status">
            <p>No focus activity in the last 7 days.</p>
            <span>Complete a focus session to see it here.</span>
          </div>
        )}
      </div>
    </Card>
  );
}

export default AnalyticsPanel;
