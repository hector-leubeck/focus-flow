import { beforeEach, describe, expect, it } from "vitest";
import { safeLocalStorage } from "./persistence";

describe("safeLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("round-trips structured values", () => {
    safeLocalStorage.setItem("focusflow-test", {
      state: { tasks: [{ id: "task-1" }] },
      version: 0,
    });

    expect(safeLocalStorage.getItem("focusflow-test")).toEqual({
      state: { tasks: [{ id: "task-1" }] },
      version: 0,
    });
  });

  it("removes malformed JSON instead of throwing", () => {
    localStorage.setItem("focusflow-invalid", "{not-json");

    expect(safeLocalStorage.getItem("focusflow-invalid")).toBeNull();
    expect(localStorage.getItem("focusflow-invalid")).toBeNull();
  });
});
