import { BaseService } from "@/utils/BaseService";
import { Emitter } from "@/utils/Emitter";
import { SettingsRepository } from "@/repositories/SettingsRepository";
import { ThemeManager } from "@/utils/ThemeManager";

export class ThemeService extends BaseService {
  private readonly themeManager: ThemeManager;

  constructor(
    private readonly settingsRepository: SettingsRepository,
    emitter: Emitter,
    targetElement?: HTMLElement
  ) {
    super("ThemeService", emitter);
    this.themeManager = new ThemeManager(targetElement);
  }

  async init(): Promise<void> {
    this.logger.info("Initializing theme service");

    await this.applyThemeFromSettings();

    this.emitter.on("SETTINGS_UPDATED", (settings) => {
      if (settings && typeof settings === "object" && "theme" in settings) {
        this.logger.info("Settings updated, applying theme", {
          theme: settings.theme,
        });
        this.themeManager.applyTheme(settings.theme);
      } else {
        void this.applyThemeFromSettings();
      }
    });
  }

  private async applyThemeFromSettings(): Promise<void> {
    try {
      const settings = await this.settingsRepository.get();
      this.themeManager.applyTheme(settings.theme);
    } catch (error) {
      this.logger.error("Failed to load and apply theme", { error });

      this.themeManager.applyTheme("system");
    }
  }
}
