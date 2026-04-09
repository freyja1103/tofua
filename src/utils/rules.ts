export interface Rule<T> {
  test: (ua: string) => boolean;
  resolve: (ua: string) => T;
}

export function matchFirstRule<T>(
  ua: string,
  rules: readonly Rule<T>[],
  fallback: T,
): T {
  for (const rule of rules) {
    if (rule.test(ua)) {
      return rule.resolve(ua);
    }
  }

  return fallback;
}
