import { describe, expect, it } from "vitest";

import { getBrowser } from "../src/browser";

describe("getBrowser", () => {
	it.each([
		[
			"Chrome",
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
			{ name: "Chrome", version: "135.0.0.0" },
		],
		[
			"Edge",
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.3179.54",
			{ name: "Edge", version: "135.0.3179.54" },
		],
		[
			"Safari",
			"Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
			{ name: "Safari", version: "17.4" },
		],
		[
			"Firefox",
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0",
			{ name: "Firefox", version: "137.0" },
		],
		[
			"Opera",
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/117.0.0.0",
			{ name: "Opera", version: "117.0.0.0" },
		],
		[
			"Samsung Internet",
			"Mozilla/5.0 (Linux; Android 14; SAMSUNG SM-S921B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/25.0 Chrome/135.0.0.0 Mobile Safari/537.36",
			{ name: "Samsung Internet", version: "25.0" },
		],
		["Unknown", "SomeCustomAgent/1.0", { name: "Unknown", version: null }],
		[
			"Chromium-only",
			"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chromium/135.0.0.0 Safari/537.36",
			{ name: "Unknown", version: null },
		],
	])("detects %s", (_label, userAgent, expected) => {
		expect(getBrowser(userAgent)).toEqual(expected);
	});

	it("prefers Edge over Chrome", () => {
		const userAgent =
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.3179.54";

		expect(getBrowser(userAgent)).toEqual({
			name: "Edge",
			version: "135.0.3179.54",
		});
	});

	it("prefers Opera over Chrome", () => {
		const userAgent =
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/117.0.0.0";

		expect(getBrowser(userAgent)).toEqual({
			name: "Opera",
			version: "117.0.0.0",
		});
	});

	it("does not mistake Chrome-family UAs for Safari", () => {
		const userAgent =
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36";

		expect(getBrowser(userAgent).name).not.toBe("Safari");
	});

	it("does not mistake Chromium-only UAs for Safari", () => {
		const userAgent =
			"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chromium/135.0.0.0 Safari/537.36";

		expect(getBrowser(userAgent).name).not.toBe("Safari");
	});
});
