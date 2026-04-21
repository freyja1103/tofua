import type { OSInfo, OSName } from "../types";
import { extractVersion } from "../utils/version";

export interface OSRule {
  name: OSName;
  test: (ua: string) => boolean;
  version: (ua: string) => string | null;
}

const IOS_DEVICE_TOKENS = ["iPhone", "iPad", "iPod"] as const;

function hasAnyToken(ua: string, tokens: readonly string[]): boolean {
  return tokens.some((token) => ua.includes(token));
}

export const UNKNOWN_OS: OSInfo = {
  name: "Unknown",
  version: null,
};

export const osRules: readonly OSRule[] = [
  {
    name: "iOS",
    test: (ua) => hasAnyToken(ua, IOS_DEVICE_TOKENS),
    version: (ua) =>
      extractVersion(ua, /OS (\d+(?:[_.]\d+)*)/) ??
      extractVersion(ua, /Mac OS X (\d+(?:[_.]\d+)*)/),
  },
  {
    name: "Android",
    test: (ua) => ua.includes("Android"),
    version: (ua) => extractVersion(ua, /Android (\d+(?:\.\d+)*)/),
  },
  {
    name: "Chrome OS",
    test: (ua) => ua.includes("CrOS"),
    version: (ua) => extractVersion(ua, /CrOS [^ ]+ (\d+(?:\.\d+)*)/),
  },
  {
    name: "Windows",
    test: (ua) => ua.includes("Windows NT"),
    version: (ua) => extractVersion(ua, /Windows NT (\d+(?:\.\d+)*)/),
  },
  {
    name: "macOS",
    test: (ua) =>
      ua.includes("Mac OS X") && !hasAnyToken(ua, IOS_DEVICE_TOKENS),
    version: (ua) => extractVersion(ua, /Mac OS X (\d+(?:[_.]\d+)*)/),
  },
  {
    name: "Linux",
    test: (ua) => ua.includes("Linux"),
    version: () => null,
  },
];
