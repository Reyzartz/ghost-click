import { BaseViewModel } from "@/utils/BaseViewModel";
import { Emitter } from "@/utils/Emitter";
import { Settings } from "@/models/Settings";
import { SettingsRepository } from "@/repositories/SettingsRepository";

export interface SettingsFormErrors {
  defaultRetryCount?: string;
  defaultRetryIntervalMs?: string;
  defaultSelectorType?: string;
  minimumDelayMs?: string;
  theme?: string;
  stopOnError?: string;
}

export interface SettingsState {
  loading: boolean;
  settings: Settings | null;
  formSettings: Settings | null;
  error: string | null;
  formErrors: SettingsFormErrors;
  isDirty: boolean;
  saving: boolean;
}

export class SettingsViewModel extends BaseViewModel {
  private state: SettingsState = {
    loading: false,
    settings: null,
    formSettings: null,
    error: null,
    formErrors: {},
    isDirty: false,
    saving: false,
  };
  private listeners: Array<(state: SettingsState) => void> = [];

  constructor(
    private readonly settingsRepository: SettingsRepository,
    protected readonly emitter: Emitter
  ) {
    super("SettingsViewModel", emitter);
  }

  async init(): Promise<void> {
    this.logger.info("Initializing settings view model");
    await this.loadSettings();

    // Listen for settings updates from other contexts
    this.emitter.on("SETTINGS_UPDATED", () => {
      void this.loadSettings();
    });
  }

  async loadSettings(): Promise<void> {
    this.setState({ loading: true, error: null });
    try {
      const settings = await this.settingsRepository.get();
      this.setState({
        settings,
        formSettings: { ...settings },
        loading: false,
        isDirty: false,
        formErrors: {},
      });
    } catch (error) {
      this.logger.error("Failed to load settings", { error });
      this.setState({
        error: "Failed to load settings",
        loading: false,
      });
    }
  }

  updateFormField(
    field: keyof Settings,
    value: number | string | boolean
  ): void {
    if (!this.state.formSettings) return;

    const updatedFormSettings = {
      ...this.state.formSettings,
      [field]: value,
    } as Settings;

    const errors = this.validateSettings(updatedFormSettings);

    this.setState({
      formSettings: updatedFormSettings,
      formErrors: errors,
      isDirty: true,
    });
  }

  private validateSettings(settings: Settings): SettingsFormErrors {
    const errors: SettingsFormErrors = {};

    if (settings.defaultRetryCount < 0 || settings.defaultRetryCount > 10) {
      errors.defaultRetryCount = "Must be between 0 and 10";
    }

    if (
      settings.defaultRetryIntervalMs < 100 ||
      settings.defaultRetryIntervalMs > 10000
    ) {
      errors.defaultRetryIntervalMs = "Must be between 100 and 10000ms";
    }

    if (settings.minimumDelayMs < 0 || settings.minimumDelayMs > 5000) {
      errors.minimumDelayMs = "Must be between 0 and 5000ms";
    }

    if (!["xpath", "id", "className"].includes(settings.defaultSelectorType)) {
      errors.defaultSelectorType = "Invalid selector type";
    }

    if (!["system", "light", "dark"].includes(settings.theme)) {
      errors.theme = "Invalid theme";
    }

    if (typeof settings.stopOnError !== "boolean") {
      errors.stopOnError = "Invalid value for stopOnError";
    }

    return errors;
  }

  hasValidationErrors(): boolean {
    return Object.keys(this.state.formErrors).length > 0;
  }

  async saveSettings(): Promise<void> {
    if (!this.state.formSettings || this.hasValidationErrors()) {
      this.setState({ error: "Please fix validation errors before saving" });
      return;
    }

    this.setState({ saving: true, error: null });
    try {
      await this.settingsRepository.update(this.state.formSettings);
      const settings = await this.settingsRepository.get();
      this.setState({
        settings,
        formSettings: { ...settings },
        saving: false,
        isDirty: false,
        formErrors: {},
      });

      // Notify other contexts about the settings change
      this.emitter.emit("SETTINGS_UPDATED", settings);
    } catch (error) {
      this.logger.error("Failed to save settings", { error });
      this.setState({
        error: "Failed to save settings",
        saving: false,
      });
    }
  }

  cancelChanges(): void {
    if (!this.state.settings) return;

    this.setState({
      formSettings: { ...this.state.settings },
      isDirty: false,
      formErrors: {},
      error: null,
    });
  }

  async resetSettings(): Promise<void> {
    this.setState({ saving: true, error: null });
    try {
      await this.settingsRepository.reset();
      const settings = await this.settingsRepository.get();
      this.setState({
        settings,
        formSettings: { ...settings },
        saving: false,
        isDirty: false,
        formErrors: {},
      });

      // Notify other contexts about the settings change
      this.emitter.emit("SETTINGS_UPDATED", settings);
    } catch (error) {
      this.logger.error("Failed to reset settings", { error });
      this.setState({
        error: "Failed to reset settings",
        saving: false,
      });
    }
  }

  subscribe(listener: (state: SettingsState) => void): () => void {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private setState(next: Partial<SettingsState>): void {
    this.state = { ...this.state, ...next };
    this.listeners.forEach((listener) => listener(this.state));
  }
}
