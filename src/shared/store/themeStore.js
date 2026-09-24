import { create } from "zustand";
import { persist } from "zustand/middleware";
import { safeLocalStorage } from "../lib/persistence";

export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
};

export function getSystemTheme() {
  if (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return THEMES.DARK;
  }

  return THEMES.LIGHT;
}

function isTheme(value) {
  return value === THEMES.LIGHT || value === THEMES.DARK;
}

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: getSystemTheme(),
      setTheme: (theme) => {
        if (isTheme(theme)) {
          set({ theme });
        }
      },
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK,
        })),
    }),
    {
      name: "focusflow-theme",
      storage: safeLocalStorage,
      merge: (persistedState, currentState) => ({
        ...currentState,
        theme: isTheme(persistedState?.theme)
          ? persistedState.theme
          : currentState.theme,
      }),
    },
  ),
);
