export function normalizeUA(input?: string | null): string {
  return typeof input === "string" ? input.trim() : "";
}
