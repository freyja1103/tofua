import { afterEach, describe, expect, it, vi } from "vitest";

import { getUA, parseUA, safeParseUA } from "../src/parse";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("parseUA", () => {
  it("returns both OS and browser info", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36";

    expect(parseUA(userAgent)).toEqual({
      os: { name: "Windows", version: "10.0" },
      browser: { name: "Chrome", version: "135.0.0.0" },
      raw: userAgent,
    });
  });

  it("returns Unknown for an empty string", () => {
    expect(parseUA("")).toEqual({
      os: { name: "Unknown", version: null },
      browser: { name: "Unknown", version: null },
      raw: "",
    });
  });

  it("preserves the raw input without normalization", () => {
    const userAgent =
      "  Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/135.0.0.0 Safari/537.36  ";

    expect(parseUA(userAgent).raw).toBe(userAgent);
  });
});

describe("safeParseUA", () => {
  it("normalizes undefined to an empty string", () => {
    expect(safeParseUA(undefined)).toEqual({
      os: { name: "Unknown", version: null },
      browser: { name: "Unknown", version: null },
      raw: "",
    });
  });

  it("normalizes null to an empty string", () => {
    expect(safeParseUA(null)).toEqual({
      os: { name: "Unknown", version: null },
      browser: { name: "Unknown", version: null },
      raw: "",
    });
  });

  it("trims the raw value before parsing", () => {
    const userAgent =
      "  Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36  ";

    expect(safeParseUA(userAgent)).toEqual({
      os: { name: "Windows", version: "10.0" },
      browser: { name: "Chrome", version: "135.0.0.0" },
      raw: userAgent.trim(),
    });
  });

  it("handles non-string runtime input defensively", () => {
    // This mirrors callers that bypass TypeScript and hand us invalid runtime values.
    expect(safeParseUA(123 as unknown as string)).toEqual({
      os: { name: "Unknown", version: null },
      browser: { name: "Unknown", version: null },
      raw: "",
    });
  });
});

describe("getUA", () => {
  it("wraps navigator.userAgent with parseUA", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36";

    vi.stubGlobal("navigator", { userAgent });

    expect(getUA()).toEqual(parseUA(userAgent));
  });

  it("returns Unknown when navigator is absent", () => {
    vi.stubGlobal("navigator", undefined);

    expect(getUA()).toEqual({
      os: { name: "Unknown", version: null },
      browser: { name: "Unknown", version: null },
      raw: "",
    });
  });

  it("returns Unknown when navigator.userAgent is unavailable", () => {
    vi.stubGlobal("navigator", {});

    expect(getUA()).toEqual({
      os: { name: "Unknown", version: null },
      browser: { name: "Unknown", version: null },
      raw: "",
    });
  });
});
