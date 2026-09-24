import {
  BarChart3,
  CheckSquare2,
  ChevronDown,
  Clock3,
  LayoutDashboard,
  Menu,
  Plus,
  Sparkles,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Button from "../shared/components/Button";
import IconButton from "../shared/components/IconButton";
import SectionHeader from "../shared/components/SectionHeader";
import ThemeToggle from "../shared/components/ThemeToggle";
import TaskPreview from "../features/tasks/components/TaskPreview";
import FocusTimer from "../features/focus-timer/components/FocusTimer";
import AnalyticsPanel from "../features/analytics/components/AnalyticsPanel";
import "./App.css";

const navigationItems = [
  { label: "Overview", icon: LayoutDashboard, href: "#overview" },
  { label: "Tasks", icon: CheckSquare2, href: "#tasks" },
  { label: "Focus timer", icon: Clock3, href: "#focus-timer" },
  { label: "Analytics", icon: BarChart3, href: "#analytics" },
];

function Brand() {
  return (
    <a className="brand" href="#overview" aria-label="FocusFlow overview">
      <span className="brand-mark" aria-hidden="true">
        <Sparkles size={17} strokeWidth={2.4} />
      </span>
      <span>FocusFlow</span>
    </a>
  );
}

function NavigationLink({ item, mobile = false }) {
  const Icon = item.icon;

  return (
    <a
      className={`navigation-link${item.label === "Overview" ? " is-active" : ""}${mobile ? " is-mobile" : ""}`}
      href={item.href}
    >
      <Icon
        size={mobile ? 19 : 18}
        strokeWidth={item.label === "Overview" ? 2.3 : 1.9}
      />
      <span>{item.label}</span>
    </a>
  );
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <Brand />
      <div className="sidebar-section-label">Workspace</div>
      <nav className="navigation-list" aria-label="Main navigation">
        {navigationItems.map((item) => (
          <NavigationLink key={item.label} item={item} />
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-footer-mark">FF</div>
        <div>
          <p className="sidebar-footer-title">Personal space</p>
          <p className="sidebar-footer-caption">Local workspace</p>
        </div>
        <ChevronDown size={15} aria-hidden="true" />
      </div>
    </aside>
  );
}

function MobileNavigation() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.nav
      className="mobile-navigation"
      aria-label="Mobile navigation"
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
    >
      {navigationItems.map((item) => (
        <NavigationLink key={item.label} item={item} mobile />
      ))}
    </motion.nav>
  );
}

function DashboardHeader() {
  return (
    <header className="dashboard-header">
      <div className="header-copy">
        <p className="eyebrow">Wednesday, 23 September</p>
        <h1>Good morning, Alex.</h1>
        <p className="header-description">
          Set the pace for a focused and intentional day.
        </p>
      </div>
      <div className="header-actions">
        <IconButton label="Open menu" className="mobile-menu-button">
          <Menu size={19} />
        </IconButton>
        <ThemeToggle />
        <Button className="new-task-button" disabled>
          <Plus size={17} strokeWidth={2.5} />
          <span>New task</span>
        </Button>
        <div className="avatar" aria-label="Alex Morgan">
          AM
        </div>
      </div>
    </header>
  );
}

function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-content">
        <DashboardHeader />
        <main className="dashboard-main" id="overview">
          <SectionHeader
            className="welcome-band"
            eyebrow="Your command center"
            title="Make room for deep work."
            description="A clear view of what deserves your attention today."
          />

          <TaskPreview />

          <div className="feature-grid">
            <FocusTimer />
            <AnalyticsPanel />
          </div>
        </main>
      </div>
      <MobileNavigation />
    </div>
  );
}

export default App;
