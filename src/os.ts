import { osRules, UNKNOWN_OS } from "./rules/osRules";
import type { OSInfo } from "./types";
import { matchFirstRule, type Rule } from "./utils/rules";

const resolvedOSRules: readonly Rule<OSInfo>[] = osRules.map((rule) => ({
  test: rule.test,
  resolve: (ua: string): OSInfo => ({
    name: rule.name,
    version: rule.version(ua),
  }),
}));

export function getOS(userAgent: string): OSInfo {
  return matchFirstRule(userAgent, resolvedOSRules, UNKNOWN_OS);
}
