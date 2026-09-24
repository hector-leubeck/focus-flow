import { Moon, Sun } from "lucide-react";
import IconButton from "./IconButton";
import { THEMES, useThemeStore } from "../store/themeStore";

function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const isDark = theme === THEMES.DARK;

  return (
    <IconButton
      label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      className="theme-toggle"
      onClick={toggleTheme}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </IconButton>
  );
}

export default ThemeToggle;
