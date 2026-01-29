class MacroUtils {
  static DEFAULT_MACRO_NAME_PREFIX = "Untitled Macro ";
  static DEFAULT_RETRY_COUNT = 3;
  static DEFAULT_RETRY_INTERVAL_MS = 1000;
  static DEFAULT_SELECTOR_TYPE = "xpath" as const;

  static extractDomainFromURL(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return "unknown";
    }
  }

  static getFaviconFromURL(url: string): string {
    try {
      const urlObj = new URL(url);
      return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
    } catch {
      return "";
    }
  }

  static getDefaultMacroName(): string {
    return `${this.DEFAULT_MACRO_NAME_PREFIX}${new Date().toLocaleString()}`;
  }

  static generateMacroId(): string {
    return crypto.randomUUID();
  }

  static generateStepId(): string {
    return crypto.randomUUID();
  }

  static generateSessionId(): string {
    return crypto.randomUUID();
  }
}

export { MacroUtils };
