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
  | "Android WebView"
  | "iOS WebView"
  | "Internet Explorer"
  | "Oculus Browser"
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
