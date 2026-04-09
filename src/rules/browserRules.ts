import type { BrowserInfo, BrowserName } from "../types";
import { extractVersion } from "../utils/version";

export interface BrowserRule {
  name: BrowserName;
  test: (ua: string) => boolean;
  version: (ua: string) => string | null;
}

function excludes(ua: string, blockedTokens: readonly string[]): boolean {
  return blockedTokens.every((token) => !ua.includes(token));
}

export const UNKNOWN_BROWSER: BrowserInfo = {
  name: "Unknown",
  version: null,
};

export const browserRules: readonly BrowserRule[] = [
  {
    name: "Edge",
    test: (ua) => ua.includes("Edg/"),
    version: (ua) => extractVersion(ua, /Edg\/(\d+(?:\.\d+)*)/),
  },
  {
    name: "Opera",
    test: (ua) => ua.includes("OPR/"),
    version: (ua) => extractVersion(ua, /OPR\/(\d+(?:\.\d+)*)/),
  },
  {
    name: "Samsung Internet",
    test: (ua) => ua.includes("SamsungBrowser/"),
    version: (ua) => extractVersion(ua, /SamsungBrowser\/(\d+(?:\.\d+)*)/),
  },
  {
    name: "Chrome",
    test: (ua) =>
      ua.includes("Chrome/") &&
      excludes(ua, ["Edg/", "OPR/", "SamsungBrowser/"]),
    version: (ua) => extractVersion(ua, /Chrome\/(\d+(?:\.\d+)*)/),
  },
  {
    name: "Safari",
    test: (ua) =>
      ua.includes("Safari/") &&
      ua.includes("Version/") &&
      excludes(ua, ["Chrome/", "Chromium/", "Edg/", "OPR/"]),
    version: (ua) => extractVersion(ua, /Version\/(\d+(?:\.\d+)*)/),
  },
  {
    name: "Firefox",
    test: (ua) => ua.includes("Firefox/"),
    version: (ua) => extractVersion(ua, /Firefox\/(\d+(?:\.\d+)*)/),
  },
];
