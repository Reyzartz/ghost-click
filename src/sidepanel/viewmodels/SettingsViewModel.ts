import { BaseViewModel } from "@/utils/BaseViewModel";
import { Emitter } from "@/utils/Emitter";

export interface SettingsState {
  loading: boolean;
}

export class SettingsViewModel extends BaseViewModel {
  private state: SettingsState = {
    loading: false,
  };
  private listeners: Array<(state: SettingsState) => void> = [];

  constructor(protected readonly emitter: Emitter) {
    super("SettingsViewModel", emitter);
  }

  async init(): Promise<void> {
    this.logger.info("Initializing settings view model");

    return Promise.resolve();
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
