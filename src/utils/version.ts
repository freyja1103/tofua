export function extractVersion(ua: string, regex: RegExp): string | null {
  const match = ua.match(regex);
  const value = match?.[1];

  if (!value) {
    return null;
  }

  return value.replace(/_/g, ".");
}
