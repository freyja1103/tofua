import { getBrowser } from "./browser";
import { getOS } from "./os";
import type { UAResult } from "./types";
import { normalizeUA } from "./utils/normalize";

interface NavigatorLike {
  userAgent?: string;
}

export function parseUA(userAgent: string): UAResult {
  return {
    os: getOS(userAgent),
    browser: getBrowser(userAgent),
    raw: userAgent,
  };
}

/**
 * Parses the current environment's User-Agent string.
 *
 * In browser environments this wraps `parseUA(navigator.userAgent)`.
 * If `navigator.userAgent` is unavailable, it returns an `Unknown` result.
 */
export function getUA(): UAResult {
  const runtimeGlobal = globalThis as { navigator?: NavigatorLike };
  const currentNavigator =
    typeof runtimeGlobal.navigator === "object"
      ? runtimeGlobal.navigator
      : undefined;
  const userAgent =
    typeof currentNavigator?.userAgent === "string"
      ? currentNavigator.userAgent
      : "";

  return parseUA(userAgent);
}

export function safeParseUA(userAgent?: string | null): UAResult {
  const raw = normalizeUA(userAgent);

  return {
    os: getOS(raw),
    browser: getBrowser(raw),
    raw,
  };
}
