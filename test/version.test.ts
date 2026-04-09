import { describe, expect, it } from "vitest";

import { extractVersion } from "../src/utils/version";

describe("extractVersion", () => {
  it("extracts a dotted version", () => {
    const userAgent = "Mozilla/5.0 Chrome/135.0.0.0 Safari/537.36";

    expect(extractVersion(userAgent, /Chrome\/(\d+(?:\.\d+)*)/)).toBe(
      "135.0.0.0",
    );
  });

  it("normalizes underscores to dots", () => {
    const userAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X)";

    expect(extractVersion(userAgent, /OS (\d+(?:[_.]\d+)*)/)).toBe("17.4");
  });

  it("returns null when the pattern does not match", () => {
    expect(extractVersion("Mozilla/5.0", /Chrome\/(\d+(?:\.\d+)*)/)).toBeNull();
  });

  it("returns null for an empty capture", () => {
    expect(extractVersion("Version/", /Version\/([^ ]*)/)).toBeNull();
  });
});
