# tofua

A tiny User-Agent parser for OS and browser detection.

`tofua` focuses on a very small surface area:

- OS detection
- browser detection
- version extraction when it is reliable
- predictable `Unknown` fallbacks

It does not try to do device detection, bot detection, engine detection, or Client Hints parsing.

## Installation

```bash
pnpm add tofua
```

## Quick Start

```ts
import { getUA, parseUA } from "tofua";

const userAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36";

const result = parseUA(userAgent);
const current = getUA();

console.log(result);
// {
//   os: { name: "Windows", version: "10.0" },
//   browser: { name: "Chrome", version: "135.0.0.0" },
//   raw: "Mozilla/5.0 ..."
// }
```

## API

### `parseUA(userAgent: string): UAResult`

Parses a User-Agent string and returns both OS and browser information.

```ts
import { parseUA } from "tofua";

const result = parseUA(
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
);

// {
//   os: { name: "iOS", version: "17.4" },
//   browser: { name: "Safari", version: "17.4" },
//   raw: "..."
// }
```

`parseUA` keeps the input string as-is in `raw`.

### `safeParseUA(userAgent?: string | null): UAResult`

Defensive version of `parseUA`.

- `null` and `undefined` become `""`
- string input is trimmed before parsing
- malformed or unknown input returns `Unknown`

```ts
import { safeParseUA } from "tofua";

safeParseUA(undefined);
// {
//   os: { name: "Unknown", version: null },
//   browser: { name: "Unknown", version: null },
//   raw: ""
// }
```

### `getUA(): UAResult`

Parses `navigator.userAgent` and returns the same shape as `parseUA`.

In browser environments, this is effectively a wrapper around `parseUA(navigator.userAgent)`.
If `navigator.userAgent` is unavailable, it returns an `Unknown` result with `raw: ""`.

```ts
import { getUA } from "tofua";

const current = getUA();
```

### `getOS(userAgent: string): OSInfo`

Returns only the OS result.

```ts
import { getOS } from "tofua";

getOS(
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
);
// { name: "macOS", version: "13.5.1" }
```

### `getBrowser(userAgent: string): BrowserInfo`

Returns only the browser result.

```ts
import { getBrowser } from "tofua";

getBrowser(
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.3179.54",
);
// { name: "Edge", version: "135.0.3179.54" }
```

## Types

```ts
type OSName =
  | "Windows"
  | "macOS"
  | "iOS"
  | "Android"
  | "Linux"
  | "Chrome OS"
  | "Unknown";

type BrowserName =
  | "Chrome"
  | "Edge"
  | "Safari"
  | "Firefox"
  | "Opera"
  | "Samsung Internet"
  | "Unknown";

interface OSInfo {
  name: OSName;
  version: string | null;
}

interface BrowserInfo {
  name: BrowserName;
  version: string | null;
}

interface UAResult {
  os: OSInfo;
  browser: BrowserInfo;
  raw: string;
}
```

## Detection Behavior

### OS

Supported OS names:

- `iOS`
- `Android`
- `Chrome OS`
- `Windows`
- `macOS`
- `Linux`

### Browser

Supported browser names:

- `Edge`
- `Opera`
- `Samsung Internet`
- `Chrome`
- `Safari`
- `Firefox`

Rule order matters. For example:

- Edge wins over Chrome
- Opera wins over Chrome
- Samsung Internet wins over Chrome
- Safari requires `Safari/` and `Version/`
- `Chromium/`-only User-Agent strings return `Unknown`

## Notes

- When detection is inconclusive, `tofua` returns `Unknown` instead of guessing.
- Some platforms do not expose a reliable OS version. For example, Linux returns `version: null`.
- Windows returns the raw `Windows NT` version value.
- User-Agent parsing is inherently imperfect and modern browsers continue to reduce UA detail.

## Development

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm fmt
pnpm fmt:check
```

## License

MIT
