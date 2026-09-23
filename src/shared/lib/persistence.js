const fallbackStorage = new Map();

function getBrowserStorage() {
  if (typeof globalThis !== "undefined" && globalThis.localStorage) {
    return globalThis.localStorage;
  }

  return {
    getItem: (name) => fallbackStorage.get(name) ?? null,
    setItem: (name, value) => fallbackStorage.set(name, value),
    removeItem: (name) => fallbackStorage.delete(name),
  };
}

export const safeLocalStorage = {
  getItem(name) {
    const storage = getBrowserStorage();
    const rawValue = storage.getItem(name);

    if (!rawValue) {
      return null;
    }

    try {
      const parsedValue = JSON.parse(rawValue);

      return parsedValue && typeof parsedValue === "object"
        ? parsedValue
        : null;
    } catch {
      storage.removeItem(name);
      return null;
    }
  },

  setItem(name, value) {
    try {
      getBrowserStorage().setItem(name, JSON.stringify(value));
    } catch {
      // Storage can be unavailable or full; the app remains usable in memory.
    }
  },

  removeItem(name) {
    getBrowserStorage().removeItem(name);
  },
};
