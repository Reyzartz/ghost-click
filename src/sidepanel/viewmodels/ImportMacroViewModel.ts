import { Macro } from "@/models";
import { MacroRepository } from "@/repositories/MacroRepository";
import { MacroShareService } from "@/services/MacroShareService";
import { BaseViewModel } from "@/utils/BaseViewModel";
import { Emitter } from "@/utils/Emitter";

export interface ImportMacroState {
  isOpen: boolean;
  pastedText: string;
  parsedMacro: Omit<Macro, "id" | "createdAt" | "updatedAt"> | null;
  macroName: string;
  error: string | null;
}

export class ImportMacroViewModel extends BaseViewModel {
  private state: ImportMacroState = {
    isOpen: false,
    pastedText: "",
    parsedMacro: null,
    macroName: "",
    error: null,
  };
  private listeners: Array<(state: ImportMacroState) => void> = [];

  constructor(
    private readonly macroRepository: MacroRepository,
    private readonly macroShareService: MacroShareService,
    protected readonly emitter: Emitter
  ) {
    super("ImportMacroViewModel", emitter);
  }

  init(): Promise<void> {
    this.logger.info("ImportMacroViewModel initialized");

    this.emitter.on("OPEN_IMPORT_MACRO_MODAL", () => {
      this.openModal();
    });

    return Promise.resolve();
  }

  subscribe(listener: (state: ImportMacroState) => void): () => void {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private setState(next: Partial<ImportMacroState>): void {
    this.state = { ...this.state, ...next };
    this.listeners.forEach((l) => l(this.state));
  }

  openModal(): void {
    this.logger.info("Opening import macro modal");
    this.setState({ isOpen: true });
  }

  closeModal(): void {
    this.logger.info("Closing import macro modal");
    this.setState({
      isOpen: false,
      pastedText: "",
      parsedMacro: null,
      macroName: "",
      error: null,
    });
  }

  updatePastedText(text: string): void {
    this.setState({ pastedText: text, error: null });

    if (!text.trim()) {
      this.setState({ parsedMacro: null, macroName: "" });
      return;
    }

    try {
      const parsedMacro = this.macroShareService.fromShareableString(text);
      this.logger.info("Successfully parsed macro", { name: parsedMacro.name });
      this.setState({
        parsedMacro,
        macroName: parsedMacro.name,
        error: null,
      });
    } catch (err) {
      this.logger.error("Failed to parse macro", { err });
      this.setState({
        parsedMacro: null,
        macroName: "",
        error: err instanceof Error ? err.message : "Invalid macro format",
      });
    }
  }

  updateMacroName(name: string): void {
    this.setState({ macroName: name });
  }

  async saveMacro(): Promise<string | null> {
    if (!this.state.parsedMacro || !this.state.macroName.trim()) {
      this.setState({ error: "Please provide a valid macro name" });
      return null;
    }

    try {
      const now = Date.now();
      const macro: Macro = {
        id: crypto.randomUUID(),
        name: this.state.macroName.trim(),
        initialUrl: this.state.parsedMacro.initialUrl,
        domain: this.state.parsedMacro.domain,
        faviconUrl: this.state.parsedMacro.faviconUrl,
        steps: this.state.parsedMacro.steps,
        createdAt: now,
        updatedAt: now,
      };

      this.logger.info("Saving imported macro", { name: macro.name });
      await this.macroRepository.save(macro);
      this.logger.info("Imported macro saved", { id: macro.id });

      this.closeModal();
      return macro.id;
    } catch (err) {
      this.logger.error("Failed to save imported macro", { err });
      this.setState({
        error: err instanceof Error ? err.message : "Failed to save macro",
      });
      return null;
    }
  }

  createAndEdit(): void {
    if (!this.state.parsedMacro || !this.state.macroName.trim()) {
      this.setState({ error: "Please provide a valid macro name" });
      return;
    }

    const now = Date.now();
    const macro: Macro = {
      id: crypto.randomUUID(),
      name: this.state.macroName.trim(),
      initialUrl: this.state.parsedMacro.initialUrl,
      domain: this.state.parsedMacro.domain,
      faviconUrl: this.state.parsedMacro.faviconUrl,
      steps: this.state.parsedMacro.steps,
      createdAt: now,
      updatedAt: now,
    };

    this.logger.info("Creating macro for editing", { name: macro.name });

    // Emit event with unsaved macro so EditMacroViewModel can load it in create mode
    this.emitter.emit("CREATE_MACRO", { macro });
    this.closeModal();
  }
}
