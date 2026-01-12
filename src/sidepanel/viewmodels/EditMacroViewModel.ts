import { Macro } from "@/models";
import { MacroRepository } from "@/repositories/MacroRepository";
import { BaseViewModel } from "@/utils/BaseViewModel";
import { Emitter } from "@/utils/Emitter";

export interface EditMacroState {
  loading: boolean;
  macro: Macro | null;
  error?: string | null;
  success?: boolean;
}

export class EditMacroViewModel extends BaseViewModel {
  private state: EditMacroState = {
    loading: false,
    macro: null,
    error: null,
    success: false,
  };
  private listeners: Array<(state: EditMacroState) => void> = [];

  constructor(
    private readonly macroRepository: MacroRepository,
    protected readonly emitter: Emitter
  ) {
    super("EditMacroViewModel", emitter);
  }

  async init(): Promise<void> {
    this.logger.info("Initializing edit macro view model");
  }

  subscribe(listener: (state: EditMacroState) => void): () => void {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private setState(next: Partial<EditMacroState>): void {
    this.state = { ...this.state, ...next };
    this.listeners.forEach((l) => l(this.state));
  }

  async loadMacro(macroId: string): Promise<void> {
    this.logger.info("Loading macro for edit", { macroId });
    this.setState({ loading: true, error: null, success: false });

    try {
      const macro = await this.macroRepository.findById(macroId);

      if (!macro) {
        this.logger.error("Macro not found", { macroId });
        this.setState({
          loading: false,
          error: "Macro not found",
          macro: null,
        });
        return;
      }

      this.setState({ loading: false, macro, error: null });
      this.logger.info("Loaded macro for edit", { macroId, name: macro.name });
    } catch (err) {
      this.logger.error("Failed to load macro", { macroId, err });
      this.setState({
        loading: false,
        error: "Failed to load macro",
        macro: null,
      });
    }
  }

  async updateMacroName(newName: string): Promise<void> {
    if (!this.state.macro) {
      this.logger.error("Cannot update name: no macro loaded");
      this.setState({ error: "No macro loaded" });
      return;
    }

    const trimmedName = newName.trim();

    if (!trimmedName) {
      this.setState({ error: "Name cannot be empty" });
      return;
    }

    if (trimmedName === this.state.macro.name) {
      this.logger.info("Name unchanged, skipping update");
      return;
    }

    this.logger.info("Updating macro name", {
      macroId: this.state.macro.id,
      oldName: this.state.macro.name,
      newName: trimmedName,
    });

    this.setState({ loading: true, error: null, success: false });

    try {
      // Check if name is already taken
      const existingMacro = await this.macroRepository.findByName(trimmedName);
      if (existingMacro && existingMacro.id !== this.state.macro.id) {
        this.setState({
          loading: false,
          error: "A macro with this name already exists",
        });
        return;
      }

      const updatedMacro: Macro = {
        id: this.state.macro.id,
        name: trimmedName,
        initialUrl: this.state.macro.initialUrl,
        domain: this.state.macro.domain,
        steps: this.state.macro.steps,
        createdAt: this.state.macro.createdAt,
        updatedAt: Date.now(),
      };

      await this.macroRepository.save(updatedMacro);

      this.setState({
        loading: false,
        macro: updatedMacro,
        success: true,
        error: null,
      });

      this.logger.info("Updated macro name", {
        macroId: updatedMacro.id,
        newName: trimmedName,
      });
    } catch (err) {
      this.logger.error("Failed to update macro name", { err });
      this.setState({
        loading: false,
        error: "Failed to update macro name",
        success: false,
      });
    }
  }

  reset(): void {
    this.setState({
      loading: false,
      macro: null,
      error: null,
      success: false,
    });
  }
}
