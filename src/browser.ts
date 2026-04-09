import { browserRules, UNKNOWN_BROWSER } from "./rules/browserRules";
import type { BrowserInfo } from "./types";
import { matchFirstRule, type Rule } from "./utils/rules";

const resolvedBrowserRules: readonly Rule<BrowserInfo>[] = browserRules.map(
  (rule) => ({
    test: rule.test,
    resolve: (ua: string): BrowserInfo => ({
      name: rule.name,
      version: rule.version(ua),
    }),
  }),
);

export function getBrowser(userAgent: string): BrowserInfo {
  return matchFirstRule(userAgent, resolvedBrowserRules, UNKNOWN_BROWSER);
}
