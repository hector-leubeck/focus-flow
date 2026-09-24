import { beforeEach, describe, expect, it, vi } from "vitest";
import { safeLocalStorage } from "../lib/persistence";
import { getSystemTheme, THEMES, useThemeStore } from "./themeStore";

describe("themeStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useThemeStore.setState({ theme: THEMES.LIGHT });
  });

  it("toggles and persists the selected theme", () => {
    useThemeStore.getState().toggleTheme();

    expect(useThemeStore.getState().theme).toBe(THEMES.DARK);
    expect(safeLocalStorage.getItem("focusflow-theme")).toMatchObject({
      state: { theme: THEMES.DARK },
    });
  });

  it("ignores an invalid persisted theme", async () => {
    safeLocalStorage.setItem("focusflow-theme", {
      state: { theme: "neon" },
      version: 0,
    });

    await useThemeStore.persist.rehydrate();

    expect(useThemeStore.getState().theme).toBe(THEMES.LIGHT);
  });

  it("uses the system preference when no saved preference exists", () => {
    const originalMatchMedia = window.matchMedia;

    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockReturnValue({ matches: true }),
    });

    try {
      expect(getSystemTheme()).toBe(THEMES.DARK);
    } finally {
      Object.defineProperty(window, "matchMedia", {
        configurable: true,
        value: originalMatchMedia,
      });
    }
  });
});
