import { Theme } from "@/models/Settings";
import { Logger } from "./Logger";

export class ThemeManager {
  private readonly logger: Logger;
  private mediaQuery: MediaQueryList | null = null;

  constructor(
    private readonly targetElement: HTMLElement = document.documentElement
  ) {
    this.logger = new Logger("ThemeManager");
  }

  applyTheme(theme: Theme): void {
    this.logger.info("Applying theme", { theme: theme as string });

    this.targetElement.removeAttribute("data-theme");

    if (theme === "system") {
      this.setupSystemThemeListener();
      const systemTheme = ThemeManager.getCurrentSystemTheme() as string;

      this.targetElement.setAttribute("data-theme", systemTheme);
    } else {
      this.targetElement.setAttribute("data-theme", theme as string);
      this.cleanupSystemThemeListener();
    }
  }

  private handleSystemThemeChange(e: MediaQueryListEvent): void {
    if (e.matches) {
      this.applyTheme("dark");
    } else {
      this.applyTheme("light");
    }
  }

  static getCurrentSystemTheme(): Theme {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  }

  private setupSystemThemeListener(): void {
    if (this.mediaQuery) return;

    this.mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    this.mediaQuery.addEventListener(
      "change",
      this.handleSystemThemeChange.bind(this)
    );
  }

  private cleanupSystemThemeListener(): void {
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener(
        "change",
        this.handleSystemThemeChange.bind(this)
      );
      this.mediaQuery = null;
    }
  }
}
