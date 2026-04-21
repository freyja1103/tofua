import { describe, expect, it } from "vitest";

import { getBrowser } from "../src/browser";

describe("getBrowser", () => {
  it.each([
    [
      "Chrome",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
      { name: "Chrome", version: "135.0.0.0" },
    ],
    [
      "Chrome on iOS",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 26_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/144.0.7559.95 Mobile/15E148 Safari/604.1",
      { name: "Chrome", version: "144.0.7559.95" },
    ],
    [
      "Edge",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.3179.54",
      { name: "Edge", version: "135.0.3179.54" },
    ],
    [
      "Safari",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
      { name: "Safari", version: "17.4" },
    ],
    [
      "Firefox",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0",
      { name: "Firefox", version: "137.0" },
    ],
    [
      "Opera",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/117.0.0.0",
      { name: "Opera", version: "117.0.0.0" },
    ],
    [
      "Samsung Internet",
      "Mozilla/5.0 (Linux; Android 14; SAMSUNG SM-S921B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/25.0 Chrome/135.0.0.0 Mobile Safari/537.36",
      { name: "Samsung Internet", version: "25.0" },
    ],
    [
      "Oculus Browser",
      "Mozilla/5.0 (X11; Linux x86_64; Quest 2) AppleWebKit/537.36 (KHTML, like Gecko) OculusBrowser/30.0.0.4.87.517018317 Chrome/112.0.5615.136 VR Safari/537.36",
      { name: "Oculus Browser", version: "30.0.0.4.87.517018317" },
    ],
    [
      "Android WebView",
      "Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/135.0.0.0 Mobile Safari/537.36",
      { name: "Android WebView", version: "135.0.0.0" },
    ],
    [
      "iOS WebView",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
      { name: "iOS WebView", version: null },
    ],
    [
      "Internet Explorer",
      "Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko",
      { name: "Internet Explorer", version: "11.0" },
    ],
    ["Unknown", "SomeCustomAgent/1.0", { name: "Unknown", version: null }],
    [
      "Chromium-only",
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chromium/135.0.0.0 Safari/537.36",
      { name: "Unknown", version: null },
    ],
  ])("detects %s", (_label, userAgent, expected) => {
    expect(getBrowser(userAgent)).toEqual(expected);
  });

  it("prefers Edge over Chrome", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.3179.54";

    expect(getBrowser(userAgent)).toEqual({
      name: "Edge",
      version: "135.0.3179.54",
    });
  });

  it("prefers Opera over Chrome", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/117.0.0.0";

    expect(getBrowser(userAgent)).toEqual({
      name: "Opera",
      version: "117.0.0.0",
    });
  });

  it("prefers Oculus Browser over Chrome", () => {
    const userAgent =
      "Mozilla/5.0 (X11; Linux x86_64; Quest 2) AppleWebKit/537.36 (KHTML, like Gecko) OculusBrowser/30.0.0.4.87.517018317 Chrome/112.0.5615.136 VR Safari/537.36";

    expect(getBrowser(userAgent)).toEqual({
      name: "Oculus Browser",
      version: "30.0.0.4.87.517018317",
    });
  });

  it("prefers Android WebView over Chrome", () => {
    const userAgent =
      "Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/135.0.0.0 Mobile Safari/537.36";

    expect(getBrowser(userAgent)).toEqual({
      name: "Android WebView",
      version: "135.0.0.0",
    });
  });

  it("does not mistake Chrome-family UAs for Safari", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36";

    expect(getBrowser(userAgent).name).not.toBe("Safari");
  });

  it("does not mistake Chromium-only UAs for Safari", () => {
    const userAgent =
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chromium/135.0.0.0 Safari/537.36";

    expect(getBrowser(userAgent).name).not.toBe("Safari");
  });
});
