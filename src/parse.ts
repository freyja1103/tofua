import { getBrowser } from "./browser";
import { getOS } from "./os";
import type { UAResult } from "./types";
import { normalizeUA } from "./utils/normalize";

export function parseUA(userAgent: string): UAResult {
  return {
    os: getOS(userAgent),
    browser: getBrowser(userAgent),
    raw: userAgent,
  };
}

export function safeParseUA(userAgent?: string | null): UAResult {
  const raw = normalizeUA(userAgent);

  return {
    os: getOS(raw),
    browser: getBrowser(raw),
    raw,
  };
}
