import { describe, expect, it } from "vitest";

import { getBrowser } from "../src/browser";

describe("getBrowser", () => {
  it.each([
    [
      "Chrome",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
      { name: "Chrome", version: "148.0.0.0" },
    ],
    [
      "Chrome on iOS",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 26_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/148.0.7778.100 Mobile/15E148 Safari/604.1",
      { name: "Chrome", version: "148.0.7778.100" },
    ],
    [
      "Edge",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0",
      { name: "Edge", version: "148.0.0.0" },
    ],
    [
      "Safari",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1",
      { name: "Safari", version: "26.4" },
    ],
    [
      "Firefox",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:151.0) Gecko/20100101 Firefox/151.0",
      { name: "Firefox", version: "151.0" },
    ],
    [
      "Opera",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 OPR/131.0.0.0",
      { name: "Opera", version: "131.0.0.0" },
    ],
    [
      "Samsung Internet",
      "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/120.0.6099.43 Mobile Safari/537.36",
      { name: "Samsung Internet", version: "29.0" },
    ],
    [
      "Oculus Browser",
      "Mozilla/5.0 (X11; Linux x86_64; Quest 3) AppleWebKit/537.36 (KHTML, like Gecko) OculusBrowser/42.0.0.0 Chrome/136.0.0.0 VR Safari/537.36",
      { name: "Oculus Browser", version: "42.0.0.0" },
    ],
    [
      "Android WebView",
      "Mozilla/5.0 (Linux; Android 10; K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Version/4.0 Mobile Safari/537.36",
      { name: "Android WebView", version: "127.0.0.0" },
    ],
    [
      "iOS WebView",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
      { name: "iOS WebView", version: null },
    ],
    ["Unknown", "SomeCustomAgent/1.0", { name: "Unknown", version: null }],
  ])("detects %s", (_label, userAgent, expected) => {
    expect(getBrowser(userAgent)).toEqual(expected);
  });

  it("prefers Edge over Chrome", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0";

    expect(getBrowser(userAgent)).toEqual({
      name: "Edge",
      version: "148.0.0.0",
    });
  });

  it("prefers Opera over Chrome", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 OPR/131.0.0.0";

    expect(getBrowser(userAgent)).toEqual({
      name: "Opera",
      version: "131.0.0.0",
    });
  });

  it("prefers Oculus Browser over Chrome", () => {
    const userAgent =
      "Mozilla/5.0 (X11; Linux x86_64; Quest 3) AppleWebKit/537.36 (KHTML, like Gecko) OculusBrowser/42.0.0.0 Chrome/136.0.0.0 VR Safari/537.36";

    expect(getBrowser(userAgent)).toEqual({
      name: "Oculus Browser",
      version: "42.0.0.0",
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
});
