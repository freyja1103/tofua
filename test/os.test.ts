import { describe, expect, it } from "vitest";

import { getOS } from "../src/os";

describe("getOS", () => {
  it.each([
    [
      "Windows",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
      { name: "Windows", version: "10.0" },
    ],
    [
      "macOS",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
      { name: "macOS", version: "13.5.1" },
    ],
    [
      "iOS",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1",
      { name: "iOS", version: "26.4" },
    ],
    [
      "Android",
      "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36",
      { name: "Android", version: "14" },
    ],
    [
      "Chrome OS",
      "Mozilla/5.0 (X11; CrOS x86_64 16093.68.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
      { name: "Chrome OS", version: "16093.68.0" },
    ],
    [
      "Linux",
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
      { name: "Linux", version: null },
    ],
    ["Unknown", "SomeCustomAgent/1.0", { name: "Unknown", version: null }],
  ])("detects %s", (_label, userAgent, expected) => {
    expect(getOS(userAgent)).toEqual(expected);
  });

  it("prefers iOS over macOS markers", () => {
    const userAgent =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15";

    expect(getOS(userAgent)).toEqual({ name: "iOS", version: "17.4" });
  });

  it("prefers Safari Version over legacy iPad Mac OS X markers", () => {
    const userAgent =
      "Mozilla/5.0 (iPad; CPU Mac OS X 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Mobile/15E148 Safari/604.1";

    expect(getOS(userAgent)).toEqual({ name: "iOS", version: "16.4" });
  });

  it("prefers Safari Version over frozen iPhone OS markers", () => {
    const userAgent =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1";

    expect(getOS(userAgent)).toEqual({ name: "iOS", version: "26.4" });
  });

  it("prefers Chrome OS over Linux", () => {
    const userAgent =
      "Mozilla/5.0 (X11; CrOS x86_64 16093.68.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36";

    expect(getOS(userAgent)).toEqual({
      name: "Chrome OS",
      version: "16093.68.0",
    });
  });
});
