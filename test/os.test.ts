import { describe, expect, it } from "vitest";

import { getOS } from "../src/os";

describe("getOS", () => {
  it.each([
    [
      "Windows",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
      { name: "Windows", version: "10.0" },
    ],
    [
      "macOS",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
      { name: "macOS", version: "10.15.7" },
    ],
    [
      "iOS",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 26_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/148.0.7778.100 Mobile/15E148 Safari/604.1",
      { name: "iOS", version: "26.4.2" },
    ],
    [
      "Android",
      "Mozilla/5.0 (Linux; Android 16; V2559A Build/BP2A.250605.031.A3_V000L1; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/138.0.7204.179 Mobile Safari/537.36",
      { name: "Android", version: "16" },
    ],
    [
      "Chrome OS",
      "Mozilla/5.0 (X11; CrOS x86_64 16610.44.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.7727.115 Safari/537.36",
      { name: "Chrome OS", version: "16610.44.0" },
    ],
    [
      "Linux",
      "Mozilla/5.0 (X11; Linux x86_84; Chromium) AppleWebKit/537.39 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
      { name: "Linux", version: null },
    ],
    ["Unknown", "SomeCustomAgent/1.0", { name: "Unknown", version: null }],
  ])("detects %s", (_label, userAgent, expected) => {
    expect(getOS(userAgent)).toEqual(expected);
  });

  it("prefers iOS over macOS markers", () => {
    const userAgent =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1";

    expect(getOS(userAgent)).toEqual({ name: "iOS", version: "18.7" });
  });

  it("extracts iOS version from legacy iPad Mac OS X markers", () => {
    const userAgent =
      "Mozilla/5.0 (iPad; CPU OS 13_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.144 Mobile/15E148 Safari/604.1";

    expect(getOS(userAgent)).toEqual({ name: "iOS", version: "13.2" });
  });

  it("prefers Chrome OS over Linux", () => {
    const userAgent =
      "Mozilla/5.0 (X11; CrOS x86_64 16610.44.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.7727.115 Safari/537.36";

    expect(getOS(userAgent)).toEqual({
      name: "Chrome OS",
      version: "16610.44.0",
    });
  });
});
