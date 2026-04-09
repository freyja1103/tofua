# AGENTS.md

This repository contains **magicua**, a tiny TypeScript library for parsing User-Agent strings and extracting **OS** and **Browser** information.

Before making changes, review the existing source, tests, configuration, and public API surface. Match the established style and keep the package small, predictable, and easy to maintain.

## Core Mandates

- **Conventions:** Follow existing project conventions exactly. Read surrounding code, tests, and build config before changing anything.
- **Minimal Scope:** `magicua` is intentionally small. Do not expand scope beyond OS and Browser parsing unless explicitly requested.
- **Dependencies:** Prefer **zero runtime dependencies**. Do not introduce third-party libraries unless explicitly requested.
- **API Stability:** Preserve the public API shape unless the task explicitly requires a breaking change.
- **Type Safety:** Keep TypeScript types explicit, narrow, and ergonomic for consumers.
- **Runtime Compatibility:** Changes must remain compatible with both Node.js and browser bundler environments.
- **Comments:** Add comments sparingly. Explain **why**, not **what**.
- **Do Not Guess:** If behavior is ambiguous, inspect the existing code and tests first. Prefer consistency over cleverness.

## Tone and Style

- Be concise and direct.
- Prefer minimal, high-signal output.
- Use GitHub-flavored Markdown in written responses.
- After code or file changes, briefly summarize what changed and how it was verified.

## Project Goals

`magicua` should remain:

- **Tiny**: small surface area, small bundle impact
- **Fast**: simple rule-based matching with low overhead
- **Predictable**: stable output for known inputs
- **Readable**: rules and parsing logic should be easy to inspect and extend
- **Portable**: works in Node.js, ESM, CJS, and browser-oriented builds

## Repository Structure

Recommended structure:

- `src/index.ts` — public exports
- `src/parse.ts` — `parseUA` / `safeParseUA`
- `src/os.ts` — OS parsing logic
- `src/browser.ts` — Browser parsing logic
- `src/types.ts` — shared public types
- `src/rules/osRules.ts` — OS match rules
- `src/rules/browserRules.ts` — Browser match rules
- `src/utils/` — normalization and version helpers
- `test/` or `src/**/*.test.ts` — unit tests

If the actual repository layout differs, prefer the existing layout over this recommendation.

## Public API Expectations

Unless explicitly requested otherwise, preserve these principles:

- `parseUA(userAgent: string)` returns both OS and Browser results
- `getOS(userAgent: string)` returns only OS info
- `getBrowser(userAgent: string)` returns only Browser info
- safe parsing APIs should normalize invalid input and return `Unknown` results instead of throwing

## Parsing Design Rules

- Use **deterministic rule-based parsing**
- Keep rules ordered by **priority**
- Prefer simple string checks and focused regexes over large or complex parsing logic
- Normalize version strings consistently
- Return `Unknown` when detection is not reliable
- Avoid overfitting to obscure UA formats unless covered by tests and clearly beneficial

## Detection Priorities

### OS

Apply OS rules in a deliberate order to avoid false positives. A typical order is:

1. iOS
2. Android
3. Chrome OS
4. Windows
5. macOS
6. Linux
7. Unknown

### Browser

Apply browser rules in a deliberate order to avoid Chromium-family misclassification. A typical order is:

1. Edge
2. Opera
3. Samsung Internet
4. Chrome
5. Safari
6. Firefox
7. Unknown

## Implementation Guidelines

- Keep matching rules isolated from orchestration logic
- Prefer pure functions
- Avoid hidden global state
- Avoid side effects in parsing functions
- Keep normalization centralized
- Reuse helper functions for version extraction rather than duplicating regex handling
- If adding a new rule, ensure it does not break existing precedence

## Error Handling

- Parsing functions should not throw for ordinary invalid input
- Empty, unknown, malformed, `null`, or `undefined` inputs should be normalized in safe APIs
- Use `Unknown` with `version: null` when parsing is inconclusive
- Build/test script failures must be surfaced clearly and not ignored

## Testing Standards

Write unit tests for all behavior changes.

At minimum, cover:

- known OS detection cases
- known browser detection cases
- version extraction cases
- precedence conflicts, such as:
  - Edge vs Chrome
  - Opera vs Chrome
  - Safari vs Chrome-family UAs
- empty and malformed input
- `Unknown` fallback behavior

Testing principles:

- Prefer **Vitest**
- Prefer table-driven tests where helpful
- Keep fixtures readable
- Add regression tests whenever fixing a bug
- Test both best-case behavior and failure modes

## Build and Verification

Before considering work complete, run the relevant verification commands supported by the repo.

Typical commands for this project may include:

```bash
pnpm test
pnpm build
pnpm typecheck
pnpm lint
```

If the repository uses different commands, follow the existing `package.json` scripts instead of inventing new ones. Use `pnpm` as the package manager by default.

## Dependency and Tooling Rules

- Prefer the existing toolchain already used in the repository
- Use `pnpm` as the default package manager for install, script execution, and lockfile management
- Do not introduce a framework or utility library just to save a few lines
- For packaging, preserve existing ESM/CJS/type output behavior
- For test tools, lint tools, and bundlers, match what the project already uses

## Performance Guidance

This package is small enough that simplicity is usually more important than micro-optimization, but:

- avoid repeated unnecessary regex work
- avoid large lookup tables unless justified
- avoid parsing features outside the requested scope
- consider hot-path costs in commonly used functions

## Change Workflow

For feature work, bug fixes, or refactors:

1. Understand the requested behavior and current implementation
2. Inspect nearby code, tests, and package scripts
3. Make the smallest correct change
4. Add or update tests
5. Run relevant verification commands
6. Summarize the change and verification results

## What Not To Do

- Do not add device detection, bot detection, or Client Hints support unless explicitly requested
- Do not add runtime dependencies casually
- Do not silently change return types or exported names
- Do not introduce broad abstractions for a tiny ruleset
- Do not optimize for theoretical cases at the cost of readability
- Do not change formatting/style patterns inconsistently with the rest of the repo

## Preferred Change Style

Good changes in this repo are:

- small
- explicit
- easy to review
- covered by tests
- consistent with existing naming and structure

When in doubt, choose the simpler implementation that preserves API clarity and testability.
