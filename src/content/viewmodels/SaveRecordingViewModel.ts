import { BaseViewModel } from "@/utils/BaseViewModel";
import { Emitter } from "@/utils/Emitter";
import { Macro, MacroStep } from "@/models";
import { MacroUtils } from "@/utils/MacroUtils";

export type SaveRecordingState = {
  isOpen: boolean;
  macroName: string;
  sessionId: string;
  initialUrl: string;
  domain: string;
  faviconUrl: string;
  stepCount: number;
  duration: number;
};

export class SaveRecordingViewModel extends BaseViewModel {
  private state: SaveRecordingState = {
    isOpen: false,
    macroName: "",
    sessionId: "",
    initialUrl: "",
    domain: "",
    faviconUrl: "",
    stepCount: 0,
    duration: 0,
  };
  private listeners: Array<(state: SaveRecordingState) => void> = [];
  private steps: MacroStep[] = [];

  constructor(protected readonly emitter: Emitter) {
    super("SaveRecordingViewModel", emitter);
  }

  init(): Promise<void> {
    this.logger.info("SaveRecordingViewModel initialized");

    this.emitter.on("SHOW_SAVE_RECORDING_MODAL", (data) => {
      this.showModal(data);
    });

    return Promise.resolve();
  }

  subscribe(listener: (state: SaveRecordingState) => void): () => void {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private setState(next: Partial<SaveRecordingState>): void {
    this.state = { ...this.state, ...next };
    this.listeners.forEach((l) => l(this.state));
  }

  private showModal(data: {
    sessionId: string;
    initialUrl: string;
    steps: MacroStep[];
  }): void {
    this.steps = data.steps;

    // Extract domain from URL
    const domain = MacroUtils.extractDomainFromURL(data.initialUrl);

    // Get favicon from current page
    const faviconUrl = MacroUtils.getFaviconFromURL(domain);

    // Calculate duration (difference between first and last step)
    const startTimestamp = this.steps.length > 0 ? this.steps[0].timestamp : 0;
    const endTimestamp =
      this.steps.length > 0 ? this.steps[this.steps.length - 1].timestamp : 0;
    const duration =
      startTimestamp && endTimestamp ? endTimestamp - startTimestamp : 0;

    // Generate default name
    const defaultName = MacroUtils.getDefaultMacroName();

    this.setState({
      isOpen: true,
      macroName: defaultName,
      sessionId: data.sessionId,
      initialUrl: data.initialUrl,
      domain,
      faviconUrl,
      stepCount: this.steps.length,
      duration,
    });

    this.logger.info("Save recording modal shown", {
      sessionId: data.sessionId,
      stepCount: this.steps.length,
    });
  }

  updateMacroName(name: string): void {
    this.setState({ macroName: name });
  }

  saveRecording(macroName: string): void {
    const trimmedName = macroName.trim();
    if (!trimmedName) {
      this.logger.warn("Cannot save recording with empty name");
      return;
    }

    this.logger.info("Saving recording", {
      sessionId: this.state.sessionId,
      name: trimmedName,
    });

    this.emitter.emit("SAVE_RECORDING_CONFIRMED", {
      sessionId: this.state.sessionId,
      name: trimmedName,
      initialUrl: this.state.initialUrl,
      steps: this.steps,
      faviconUrl: this.state.faviconUrl,
    });

    this.closeModal();
  }

  async openSidePanel(): Promise<void> {
    return new Promise((resolve) => {
      this.emitter.emit("OPEN_SIDE_PANEL");

      // Wait a bit to ensure the side panel has time to open
      setTimeout(() => {
        resolve();
      }, 300);
    });
  }

  async saveAndEdit(name: string): Promise<void> {
    await this.openSidePanel();

    const now = Date.now();
    const macro: Macro = {
      id: MacroUtils.generateMacroId(),
      name: name.trim(),
      initialUrl: this.state.initialUrl,
      domain: this.state.domain,
      faviconUrl: this.state.faviconUrl,
      steps: this.steps,
      createdAt: now,
      updatedAt: now,
    };

    this.logger.info("Creating macro for editing", { name: macro.name });

    this.emitter.emit("CREATE_MACRO", { macro });
    this.closeModal();
  }

  cancelRecording(): void {
    this.logger.info("Recording cancelled", {
      sessionId: this.state.sessionId,
    });

    this.emitter.emit("SAVE_RECORDING_CANCELLED", {
      sessionId: this.state.sessionId,
    });

    this.closeModal();
  }

  reRecord(): void {
    this.logger.info("Re-recording requested", {
      sessionId: this.state.sessionId,
    });

    this.emitter.emit("RE_RECORD_REQUESTED", {
      sessionId: this.state.sessionId,
      initialUrl: this.state.initialUrl,
    });

    this.closeModal();
  }

  private closeModal(): void {
    this.setState({
      isOpen: false,
      macroName: "",
      sessionId: "",
      initialUrl: "",
      domain: "",
      faviconUrl: "",
      stepCount: 0,
      duration: 0,
    });
    this.steps = [];
  }
}
