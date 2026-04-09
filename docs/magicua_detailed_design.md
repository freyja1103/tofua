# 詳細設計書

## 1. 文書情報

- 文書名: `magicua` 詳細設計書
- 対象: npm パッケージ / TypeScript ライブラリ
- 目的: User-Agent 文字列から OS と Browser を判定し、構造化された情報を返却する
- 想定利用者:
  - Node.js / Browser 環境の開発者
  - Web アプリケーションのアクセス解析機能
  - フロントエンド / バックエンドにおける簡易 UA 判定処理

---

## 2. パッケージ概要

### 2.1 背景

既存の User-Agent 解析ライブラリは高機能である一方、以下の課題がある。

- 機能が多く、OS と Browser だけ欲しい用途には過剰
- パッケージサイズが大きい場合がある
- API が広く、軽量用途には扱いづらい

`magicua` は、**OS と Browser の取得に特化したシンプルかつ軽量なライブラリ**を目指す。

### 2.2 目的

- User-Agent 文字列から OS 情報を抽出する
- User-Agent 文字列から Browser 情報を抽出する
- 軽量で扱いやすい API を提供する
- TypeScript で型安全に利用できるようにする

### 2.3 スコープ

本設計では以下を対象とする。

#### 対象

- OS 名の判定
- Browser 名の判定
- バージョン文字列の抽出
- 判定結果の構造化
- TypeScript 型定義の提供

#### 対象外

- デバイス種別判定（mobile / tablet / desktop）
- CPU アーキテクチャ判定
- Bot 判定
- レンダリングエンジン判定
- Client Hints 解析
- 完全な UA 互換性保証

---

## 3. 要件定義

### 3.1 機能要件

#### FR-01: UA 解析

入力された User-Agent 文字列を解析できること。

#### FR-02: OS 判定

以下の OS を判定できること。

- Windows
- macOS
- iOS
- Android
- Linux
- Chrome OS
- Unknown

#### FR-03: Browser 判定

以下の Browser を判定できること。

- Chrome
- Edge
- Safari
- Firefox
- Opera
- Samsung Internet
- Unknown

#### FR-04: バージョン抽出

OS および Browser について、可能な場合はバージョンを抽出できること。

#### FR-05: 構造化レスポンス

解析結果をオブジェクト形式で返却できること。

#### FR-06: 個別取得 API

OS のみ、Browser のみを取得する API を提供できること。

#### FR-07: 不正入力耐性

空文字、`null` 相当、未知の UA に対しても例外ではなく既定値を返却できること。

---

### 3.2 非機能要件

#### NFR-01: 軽量性

- 不要な依存パッケージを持たない
- 可能なら **dependency 0** を目標とする

#### NFR-02: 高速性

- 正規表現ベースの単純走査で判定可能であること
- 一般的な UA の解析で低コストに動作すること

#### NFR-03: 保守性

- OS ルールと Browser ルールを独立して管理できること
- 判定ルールの追加・修正が容易であること

#### NFR-04: 型安全性

- TypeScript 利用時に型補完が効くこと
- 判定結果の union 型を提供すること

#### NFR-05: 実行環境互換性

- Node.js
- ESM
- CommonJS
- Browser bundler 環境

---

## 4. 公開 API 設計

### 4.1 API 一覧

#### 4.1.1 `parseUA`

User-Agent を解析し、OS と Browser の両方を返す。
入力は `string` を前提とし、型の正規化は行わない。空文字の場合は `Unknown` ベースの結果を返す。

```ts
parseUA(userAgent: string): UAResult
```

#### 4.1.2 `getOS`

User-Agent から OS のみ返す。

```ts
getOS(userAgent: string): OSInfo
```

#### 4.1.3 `getBrowser`

User-Agent から Browser のみ返す。

```ts
getBrowser(userAgent: string): BrowserInfo
```

#### 4.1.4 `safeParseUA`

不正入力を含めた安全な解析用。`unknown` 系に正規化する。
`null` / `undefined` は空文字へ正規化し、文字列入力は前後空白を除去してから解析する。

```ts
safeParseUA(userAgent?: string | null): UAResult
```

---

### 4.2 型定義

```ts
export type OSName =
  | "Windows"
  | "macOS"
  | "iOS"
  | "Android"
  | "Linux"
  | "Chrome OS"
  | "Unknown";

export type BrowserName =
  | "Chrome"
  | "Edge"
  | "Safari"
  | "Firefox"
  | "Opera"
  | "Samsung Internet"
  | "Unknown";

export interface OSInfo {
  name: OSName;
  version: string | null;
}

export interface BrowserInfo {
  name: BrowserName;
  version: string | null;
}

export interface UAResult {
  os: OSInfo;
  browser: BrowserInfo;
  raw: string;
}
```

`UAResult.raw` には、実際に解析に使用した文字列を格納する。

- `parseUA` では入力文字列をそのまま返す
- `safeParseUA` では `normalizeUA` 適用後の文字列を返す

---

### 4.3 使用例

```ts
import { parseUA, getOS, getBrowser } from "magicua";

const ua =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36";

const result = parseUA(ua);
/*
{
  os: { name: "Windows", version: "10.0" },
  browser: { name: "Chrome", version: "135.0.0.0" },
  raw: "..."
}
*/

const os = getOS(ua);
// { name: "Windows", version: "10.0" }

const browser = getBrowser(ua);
// { name: "Chrome", version: "135.0.0.0" }
```

---

## 5. アーキテクチャ設計

### 5.1 全体構成

```text
src/
  index.ts
  parse.ts
  os.ts
  browser.ts
  types.ts
  rules/
    osRules.ts
    browserRules.ts
  utils/
    version.ts
    normalize.ts
```

---

### 5.2 モジュール責務

#### `index.ts`

- 公開 API の再エクスポート

#### `parse.ts`

- `parseUA`, `safeParseUA` を実装
- `getOS`, `getBrowser` を組み合わせて結果を生成

#### `os.ts`

- OS 判定ロジックを実装
- OS ルール走査とバージョン抽出を担当

#### `browser.ts`

- Browser 判定ロジックを実装
- Browser ルール走査とバージョン抽出を担当

#### `types.ts`

- 型定義を管理

#### `rules/osRules.ts`

- OS ごとのマッチ条件、優先順位、バージョン抽出条件を保持

#### `rules/browserRules.ts`

- Browser ごとのマッチ条件、優先順位、バージョン抽出条件を保持

#### `utils/version.ts`

- バージョン文字列の抽出補助

#### `utils/normalize.ts`

- 空入力や前後空白の正規化

---

## 6. 判定方式設計

### 6.1 基本方針

UA 解析は **優先順位付きルールマッチ** で行う。  
各ルールは以下を持つ。

- 判定名
- マッチ条件
- 除外条件
- バージョン抽出正規表現
- 優先順位

UA 文字列は、上から順にルールを評価し、最初に一致したものを採用する。

---

### 6.2 OS 判定ルール

#### 6.2.1 ルール定義イメージ

```ts
interface OSRule {
  name: OSName;
  test: (ua: string) => boolean;
  version: (ua: string) => string | null;
}
```

`Unknown` は通常ルールとして持たず、どのルールにも一致しない場合の既定値として扱う。

---

#### 6.2.2 優先順位

OS 判定は以下の順序で行う。

1. iOS
2. Android
3. Chrome OS
4. Windows
5. macOS
6. Linux
7. Unknown

---

#### 6.2.3 判定条件詳細

##### iOS

**判定条件**

- `iPhone`
- `iPad`
- `iPod`

**バージョン抽出**

- `OS 17_4 like Mac OS X` → `17.4`

**抽出正規表現例**

```regex
/OS (\d+(?:[_\.]\d+)*)/
```

**正規化**

- `_` を `.` に置換

##### Android

**判定条件**

- `Android`

**バージョン抽出**

```regex
/Android (\d+(?:\.\d+)*)/
```

##### Chrome OS

**判定条件**

- `CrOS`

**バージョン抽出**

```regex
/CrOS [^ ]+ (\d+(?:\.\d+)*)/
```

##### Windows

**判定条件**

- `Windows NT`

**バージョン抽出**

```regex
/Windows NT (\d+(?:\.\d+)*)/
```

**備考**  
必要に応じて表示名変換を行う余地を残す。

例:

- `10.0` → `10/11 系`
  ただし初期実装では生値返却とする。

##### macOS

**判定条件**

- `Mac OS X`
- ただし iOS 判定済みを除く

**バージョン抽出**

```regex
/Mac OS X (\d+(?:[_\.]\d+)*)/
```

**正規化**

- `_` を `.` に置換

##### Linux

**判定条件**

- `Linux`

**バージョン抽出**

- 通常は取得困難なため `null`

---

### 6.3 Browser 判定ルール

#### 6.3.1 優先順位

Browser 判定は誤判定防止のため、以下の順序で行う。

1. Edge
2. Opera
3. Samsung Internet
4. Chrome
5. Safari
6. Firefox
7. Unknown

---

#### 6.3.2 ルール定義イメージ

```ts
interface BrowserRule {
  name: BrowserName;
  test: (ua: string) => boolean;
  version: (ua: string) => string | null;
}
```

`Unknown` は通常ルールとして持たず、どのルールにも一致しない場合の既定値として扱う。

---

#### 6.3.3 判定条件詳細

##### Edge

**判定条件**

- `Edg/`

**バージョン抽出**

```regex
/Edg\/(\d+(?:\.\d+)*)/
```

##### Opera

**判定条件**

- `OPR/`

**バージョン抽出**

```regex
/OPR\/(\d+(?:\.\d+)*)/
```

##### Samsung Internet

**判定条件**

- `SamsungBrowser/`

**バージョン抽出**

```regex
/SamsungBrowser\/(\d+(?:\.\d+)*)/
```

##### Chrome

**判定条件**

- `Chrome/`
- ただし以下を除外
  - `Edg/`
  - `OPR/`
  - `SamsungBrowser/`

**バージョン抽出**

```regex
/Chrome\/(\d+(?:\.\d+)*)/
```

**備考**

- `Chromium/` のみを含む UA は Chrome とみなさず `Unknown` とする
- 本パッケージでは `Chromium` は公開 `BrowserName` の対象外であるため、誤って `Chrome` に寄せないことを優先する

##### Safari

**判定条件**

- `Safari/`
- `Version/`
- ただし `Chrome/`, `Chromium/`, `Edg/`, `OPR/` を除外

**バージョン抽出**

```regex
/Version\/(\d+(?:\.\d+)*)/
```

**備考**

- `Version/` を必須とし、曖昧な Safari 系 UA は `Unknown` を返す
- 古い Safari 互換 UA を広く拾うよりも、Chrome 系誤判定を避けた安定動作を優先する

##### Firefox

**判定条件**

- `Firefox/`

**バージョン抽出**

```regex
/Firefox\/(\d+(?:\.\d+)*)/
```

---

## 7. 主要処理フロー

### 7.1 `parseUA` 処理フロー

```text
[開始]
  ↓
入力 userAgent を受け取る
  ↓
getOS() 呼び出し
  ↓
getBrowser() 呼び出し
  ↓
UAResult を組み立て
  ↓
返却
[終了]
```

---

### 7.2 `safeParseUA` 処理フロー

```text
[開始]
  ↓
normalizeUA() を適用
  ↓
getOS()
  ↓
getBrowser()
  ↓
Unknown ベースの結果返却
[終了]
```

---

## 8. 内部関数設計

### 8.1 `normalizeUA`

```ts
function normalizeUA(input?: string | null): string;
```

**役割**

- `undefined`, `null` を空文字に変換
- 前後空白を除去

**仕様**

- `null` → `""`
- `"  abc  "` → `"abc"`
- `parseUA` では使用しない
- `safeParseUA` のみで使用する

---

### 8.2 `extractVersion`

```ts
function extractVersion(ua: string, regex: RegExp): string | null;
```

**役割**

- 正規表現のキャプチャからバージョン文字列を取得する

**仕様**

- マッチしない場合は `null`
- `_` を `.` に変換
- 不正な空文字は `null`

---

### 8.3 `matchFirstRule`

```ts
interface Rule<T> {
  test: (ua: string) => boolean;
  resolve: (ua: string) => T;
}

function matchFirstRule<T>(ua: string, rules: Rule<T>[], fallback: T): T;
```

**役割**

- ルール配列を先頭から評価し、最初に一致した結果を返す
- 一致しない場合は `fallback` を返す

---

## 9. エラーハンドリング方針

### 9.1 基本方針

本パッケージはライブラリ利用時の扱いやすさを優先し、**通常の入力不正で例外を投げない**。

#### 対象ケースと挙動

| ケース               | 挙動                         |
| -------------------- | ---------------------------- |
| 空文字               | Unknown を返す               |
| `null` / `undefined` | safe API では Unknown を返す |
| 未知の UA            | Unknown を返す               |
| バージョン未抽出     | `version: null`              |

補足:

- `parseUA("")` は `Unknown` ベースの結果を返す
- `parseUA` は非文字列入力を受け取る API ではない

---

## 10. テスト設計

### 10.1 テスト方針

- ルール単位の単体テスト
- API 単位の統合テスト
- 誤判定しやすい競合 UA の優先順位テスト
- Unknown 系の境界値テスト

---

### 10.2 テスト対象一覧

#### 10.2.1 OS 判定テスト

##### Case-OS-01 Windows

入力:

```text
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36
```

期待値:

```ts
{ name: "Windows", version: "10.0" }
```

##### Case-OS-02 macOS

入力:

```text
Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15
```

期待値:

```ts
{ name: "macOS", version: "13.5.1" }
```

##### Case-OS-03 iOS

入力:

```text
Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1
```

期待値:

```ts
{ name: "iOS", version: "17.4" }
```

##### Case-OS-04 Android

入力:

```text
Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36
```

期待値:

```ts
{ name: "Android", version: "14" }
```

##### Case-OS-05 Linux

入力:

```text
Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36
```

期待値:

```ts
{ name: "Linux", version: null }
```

##### Case-OS-06 Chrome OS

入力:

```text
Mozilla/5.0 (X11; CrOS x86_64 16093.68.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36
```

期待値:

```ts
{ name: "Chrome OS", version: "16093.68.0" }
```

##### Case-OS-07 Unknown

入力:

```text
SomeCustomAgent/1.0
```

期待値:

```ts
{ name: "Unknown", version: null }
```

---

#### 10.2.2 Browser 判定テスト

##### Case-BR-01 Chrome

入力:

```text
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36
```

期待値:

```ts
{ name: "Chrome", version: "135.0.0.0" }
```

##### Case-BR-02 Edge

入力:

```text
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.3179.54
```

期待値:

```ts
{ name: "Edge", version: "135.0.3179.54" }
```

##### Case-BR-03 Safari

入力:

```text
Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1
```

期待値:

```ts
{ name: "Safari", version: "17.4" }
```

##### Case-BR-04 Firefox

入力:

```text
Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0
```

期待値:

```ts
{ name: "Firefox", version: "137.0" }
```

##### Case-BR-05 Opera

入力:

```text
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/117.0.0.0
```

期待値:

```ts
{ name: "Opera", version: "117.0.0.0" }
```

##### Case-BR-06 Samsung Internet

入力:

```text
Mozilla/5.0 (Linux; Android 14; SAMSUNG SM-S921B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/25.0 Chrome/135.0.0.0 Mobile Safari/537.36
```

期待値:

```ts
{ name: "Samsung Internet", version: "25.0" }
```

##### Case-BR-07 Unknown

入力:

```text
SomeCustomAgent/1.0
```

期待値:

```ts
{ name: "Unknown", version: null }
```

##### Case-BR-08 Chromium-only UA

入力:

```text
Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chromium/135.0.0.0 Safari/537.36
```

期待値:

```ts
{ name: "Unknown", version: null }
```

---

#### 10.2.3 競合判定テスト

##### Chrome 系で Edge を誤判定しない

- `Chrome/xxx` と `Edg/xxx` が両方含まれる場合、Edge を返すこと

##### Chrome 系で Opera を誤判定しない

- `Chrome/xxx` と `OPR/xxx` が両方含まれる場合、Opera を返すこと

##### Safari 系で Chrome を誤判定しない

- `Safari/xxx` を含んでいても `Chrome/xxx` がある場合は Safari にしないこと

##### Safari 系で Chromium を誤判定しない

- `Safari/xxx` と `Chromium/xxx` がある場合は Safari にしないこと

---

#### 10.2.4 safe API テスト

##### Case-SAFE-01 `undefined`

- `safeParseUA(undefined)` は `raw: ""` と `Unknown` 結果を返すこと

##### Case-SAFE-02 `null`

- `safeParseUA(null)` は `raw: ""` と `Unknown` 結果を返すこと

##### Case-SAFE-03 空文字

- `safeParseUA("")` は `raw: ""` と `Unknown` 結果を返すこと

##### Case-SAFE-04 前後空白付き文字列

- `safeParseUA("  Mozilla/5.0 (...)  ")` は `raw` が trim 済みであること

##### Case-SAFE-05 `parseUA("")`

- `parseUA("")` は `raw: ""` と `Unknown` 結果を返すこと

---

#### 10.2.5 バージョン抽出ユーティリティテスト

##### Case-VER-01 抽出成功

- `/Chrome\/(\d+(?:\.\d+)*)/` から `135.0.0.0` を取得できること

##### Case-VER-02 アンダースコア正規化

- `/OS (\d+(?:[_\.]\d+)*)/` から `17_4` を受け取り `17.4` を返すこと

##### Case-VER-03 マッチなし

- 対象文字列に一致しない場合は `null` を返すこと

##### Case-VER-04 空キャプチャ防止

- 空文字キャプチャや不正な値は `null` を返すこと

---

### 10.3 テストツール

- `Vitest` を採用
- coverage を取得
- CI で Node.js 複数バージョンの実行を行う

---

## 11. パフォーマンス設計

### 11.1 方針

- ルール数を最小限に抑える
- 文字列走査を複雑化しない
- 正規表現を過度にネストしない

### 11.2 想定計算量

- OS 判定: O(n)
- Browser 判定: O(m)

ここで n, m はルール数。  
初期実装ではルール数が少ないため、実用上の性能問題は想定しない。

---

## 12. パッケージ構成設計

### 12.1 `package.json` 例

```json
{
  "name": "magicua",
  "version": "0.1.0",
  "description": "A tiny User-Agent parser for OS and browser detection.",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "sideEffects": false,
  "files": ["dist"],
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts --sourcemap",
    "test": "vitest run",
    "dev": "vitest",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  }
}
```

---

### 12.2 採用候補技術

- Language: TypeScript
- Bundler: `tsup`
- Test: `vitest`
- Lint: `eslint`
- Format: `prettier`

---

## 13. 将来拡張方針

### 13.1 拡張候補

以下はいずれも**現時点ではスコープ外**であり、本設計の初期実装には含めない。

- `getDevice()` の追加
- `isBot()` の追加
- `engine` 判定追加
- `Client Hints` 対応
- カスタムルール注入機能

### 13.2 拡張しやすい設計上の工夫

- ルール定義を `rules/` に分離
- `parseUA` をオーケストレーションのみにする
- 型定義を中央集約する

---

## 14. 制約・注意事項

### 14.1 User-Agent の限界

近年は User-Agent の凍結・簡略化が進んでいるため、すべての環境で厳密な OS / Browser 判定は保証できない。

### 14.2 Safari / Chrome 系の曖昧性

一部ブラウザは `Safari/` を含むため、**優先順位による除外判定**が重要である。

### 14.3 Windows バージョン表現

`Windows NT 10.0` は Windows 10 / 11 の両方に現れる場合があり、厳密区別は困難である。  
そのため、初期設計では **生の NT バージョン値を返却**する。

---

## 15. サンプル実装イメージ

```ts
// src/parse.ts
import { getOS } from "./os";
import { getBrowser } from "./browser";
import { normalizeUA } from "./utils/normalize";
import type { UAResult } from "./types";

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
```

```ts
// src/utils/version.ts
export function extractVersion(ua: string, regex: RegExp): string | null {
  const match = ua.match(regex);
  if (!match?.[1]) return null;
  return match[1].replace(/_/g, ".");
}
```

---

## 16. 受け入れ基準

以下を満たした場合、本設計の実装完了とみなす。

1. `parseUA`, `getOS`, `getBrowser`, `safeParseUA` が提供されている
2. 定義済み OS / Browser を判定できる
3. 主要ブラウザの優先順位誤判定テストが通る
4. TypeScript 型定義が生成される
5. ESM / CommonJS 両対応でビルドできる
6. README に基本利用例が記載されている

---

## 17. README 冒頭用の短い説明案

> `magicua` is a tiny and fast User-Agent parser for OS and browser detection.

日本語案:

> `magicua` は、User-Agent 文字列から OS と Browser を軽量に判定するための TypeScript 向けパッケージです。
