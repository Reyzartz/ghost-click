import { Macro } from "@/models";
import { MacroRepository } from "@/repositories/MacroRepository";
import { BaseViewModel } from "@/utils/BaseViewModel";
import { Emitter } from "@/utils/Emitter";
import { MacroUtils } from "@/utils/MacroUtils";

export interface DuplicateMacroState {
  isOpen: boolean;
  macroName: string;
  originalMacro: Macro | null;
  domain: string;
  faviconUrl: string;
  stepCount: number;
}

export class DuplicateMacroViewModel extends BaseViewModel {
  private state: DuplicateMacroState = {
    isOpen: false,
    macroName: "",
    originalMacro: null,
    domain: "",
    faviconUrl: "",
    stepCount: 0,
  };

  private listeners: Array<(state: DuplicateMacroState) => void> = [];

  constructor(
    private readonly macroRepository: MacroRepository,
    protected readonly emitter: Emitter
  ) {
    super("DuplicateMacroViewModel", emitter);
  }

  async init(): Promise<void> {
    this.logger.info("Initializing duplicate macro view model");

    this.emitter.on("OPEN_DUPLICATE_MACRO_MODAL", (data) => {
      if (data.macro) {
        this.openModal(data.macro);
      }
    });

    return Promise.resolve();
  }

  subscribe(listener: (state: DuplicateMacroState) => void): () => void {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private setState(next: Partial<DuplicateMacroState>): void {
    this.state = { ...this.state, ...next };
    this.listeners.forEach((l) => l(this.state));
  }

  openModal(macro: Macro): void {
    this.logger.info("Opening duplicate macro modal", { macroId: macro.id });
    this.setState({
      isOpen: true,
      macroName: `${macro.name} (Copy)`,
      originalMacro: macro,
      domain: macro.domain || "",
      faviconUrl: macro.faviconUrl || "",
      stepCount: macro.steps.length,
    });
  }

  closeModal(): void {
    this.logger.info("Closing duplicate macro modal");
    this.setState({
      isOpen: false,
      macroName: "",
      originalMacro: null,
      domain: "",
      faviconUrl: "",
      stepCount: 0,
    });
  }

  updateMacroName(name: string): void {
    this.setState({ macroName: name });
  }

  async saveDuplicate(name: string): Promise<void> {
    if (!this.state.originalMacro) {
      this.logger.error("No original macro to duplicate");
      return;
    }

    if (!name.trim()) {
      this.logger.error("Macro name is required");
      return;
    }

    try {
      this.logger.info("Saving duplicated macro", { name });

      const newMacro: Macro = {
        ...this.state.originalMacro,
        id: MacroUtils.generateMacroId(),
        name: name.trim(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await this.macroRepository.save(newMacro);
      this.logger.info("Duplicated macro saved", { id: newMacro.id });

      this.emitter.emit("SAVED_MACRO", newMacro);
      this.closeModal();
    } catch (err) {
      this.logger.error("Failed to save duplicated macro", { err });
    }
  }

  saveAndEdit(name: string): void {
    if (!this.state.originalMacro) {
      this.logger.error("No original macro to duplicate");
      return;
    }

    if (!name.trim()) {
      this.logger.error("Macro name is required");
      return;
    }

    const now = Date.now();
    const newMacro: Macro = {
      ...this.state.originalMacro,
      id: MacroUtils.generateMacroId(),
      name: name.trim(),
      createdAt: now,
      updatedAt: now,
    };

    this.logger.info("Creating duplicated macro for editing", {
      name: newMacro.name,
    });

    this.emitter.emit("CREATE_MACRO", { macro: newMacro });
    this.closeModal();
  }
}
