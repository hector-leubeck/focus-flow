import { useLayoutEffect } from "react";
import { useThemeStore } from "../../shared/store/themeStore";

function ThemeProvider({ children }) {
  const theme = useThemeStore((state) => state.theme);

  useLayoutEffect(() => {
    const root = document.documentElement;

    root.dataset.theme = theme;
    root.style.colorScheme = theme;
  }, [theme]);

  return children;
}

export default ThemeProvider;
