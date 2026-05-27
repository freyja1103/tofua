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

  it.each([
    [
      "Chrome on iOS",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 26_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/144.0.7559.95 Mobile/15E148 Safari/604.1",
      {
        os: { name: "iOS", version: "26.3.1" },
        browser: { name: "Chrome", version: "144.0.7559.95" },
      },
    ],
    [
      "Oculus Browser on Linux",
      "Mozilla/5.0 (X11; Linux x86_64; Quest 2) AppleWebKit/537.36 (KHTML, like Gecko) OculusBrowser/30.0.0.4.87.517018317 Chrome/112.0.5615.136 VR Safari/537.36",
      {
        os: { name: "Linux", version: null },
        browser: {
          name: "Oculus Browser",
          version: "30.0.0.4.87.517018317",
        },
      },
    ],
    [
      "Android WebView on Android",
      "Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/135.0.0.0 Mobile Safari/537.36",
      {
        os: { name: "Android", version: "14" },
        browser: { name: "Android WebView", version: "135.0.0.0" },
      },
    ],
    [
      "iOS WebView on iOS",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
      {
        os: { name: "iOS", version: "17.4" },
        browser: { name: "iOS WebView", version: null },
      },
    ],
  ])("returns OS and browser info for %s", (_label, userAgent, expected) => {
    expect(parseUA(userAgent)).toEqual({
      ...expected,
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
