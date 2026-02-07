import { Settings, DEFAULT_SETTINGS } from "@/models/Settings";
import { Storage } from "@/utils/Storage";
import { Logger } from "@/utils/Logger";

const SETTINGS_STORAGE_KEY = "settings";

export class SettingsRepository {
  private readonly logger: Logger;

  constructor(private readonly storage: Storage) {
    this.logger = new Logger("SettingsRepository");
  }

  async get(): Promise<Settings> {
    const settings = await this.storage.get<Settings>(SETTINGS_STORAGE_KEY);
    return settings ?? DEFAULT_SETTINGS;
  }

  async update(settings: Partial<Settings>): Promise<void> {
    const currentSettings = await this.get();
    const updatedSettings = { ...currentSettings, ...settings };
    await this.storage.set(SETTINGS_STORAGE_KEY, updatedSettings);
    this.logger.info("Settings updated", updatedSettings);
  }

  async reset(): Promise<void> {
    await this.storage.set(SETTINGS_STORAGE_KEY, DEFAULT_SETTINGS);
    this.logger.info("Settings reset to defaults");
  }
}
