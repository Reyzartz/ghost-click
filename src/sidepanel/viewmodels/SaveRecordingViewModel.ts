import { BaseViewModel } from "@/utils/BaseViewModel";
import { Emitter } from "@/utils/Emitter";
import { Macro } from "@/models";
import { MacroUtils } from "@/utils/MacroUtils";

export type SaveRecordingState = {
  isOpen: boolean;
  macro: Macro | null;
  macroName: string;
};

export class SaveRecordingViewModel extends BaseViewModel {
  private state: SaveRecordingState = {
    isOpen: false,
    macro: null,
    macroName: "",
  };
  private listeners: Array<(state: SaveRecordingState) => void> = [];

  constructor(protected readonly emitter: Emitter) {
    super("SaveRecordingViewModel", emitter);
  }

  init(): Promise<void> {
    this.logger.info("SaveRecordingViewModel initialized");

    this.emitter.on("SHOW_SAVE_RECORDING_MODAL", (data) => {
      void this.showModal(data);
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

  private showModal(data: { macro: Macro }): void {
    // Generate default name
    const defaultName = MacroUtils.getDefaultMacroName();

    this.setState({
      isOpen: true,
      macro: data.macro,
      macroName: defaultName,
    });

    this.logger.info("Save recording modal shown", {
      macroId: data.macro.id,
      stepCount: data.macro.steps.length,
    });
  }

  updateMacroName(name: string): void {
    this.setState({ macroName: name });
  }

  saveRecording(macroName: string): void {
    const trimmedName = macroName.trim();
    if (!trimmedName || !this.state.macro) {
      this.logger.warn(
        "Cannot save recording with empty name or missing macro"
      );
      return;
    }

    const macroToSave: Macro = {
      ...this.state.macro,
      name: trimmedName,
      updatedAt: Date.now(),
    };

    this.logger.info("Saving recording", {
      macroId: macroToSave.id,
      name: trimmedName,
    });

    this.emitter.emit("SAVE_RECORDING_CONFIRMED", {
      macro: macroToSave,
    });

    this.closeModal();
  }

  saveAndEdit(name: string): void {
    if (!this.state.macro) {
      this.logger.warn("Cannot save and edit: missing macro");
      return;
    }

    const macro: Macro = {
      ...this.state.macro,
      name: name.trim(),
      updatedAt: Date.now(),
    };

    this.logger.info("Creating macro for editing", { name: macro.name });

    this.emitter.emit("CREATE_MACRO", { macro });
    this.closeModal();
  }

  cancelRecording(): void {
    if (!this.state.macro) {
      this.logger.warn("Cannot cancel recording: missing macro");
      return;
    }

    this.logger.info("Recording cancelled", {
      macroId: this.state.macro.id,
    });

    this.emitter.emit("SAVE_RECORDING_CANCELLED", {
      sessionId: this.state.macro.id,
    });

    this.closeModal();
  }

  reRecord(): void {
    if (!this.state.macro) {
      this.logger.warn("Cannot re-record: missing macro");
      return;
    }

    this.logger.info("Re-recording requested", {
      macroId: this.state.macro.id,
    });

    this.emitter.emit("RE_RECORD_REQUESTED", {
      sessionId: this.state.macro.id,
    });

    this.closeModal();
  }

  private closeModal(): void {
    this.setState({
      isOpen: false,
      macro: null,
      macroName: "",
    });
  }
}
