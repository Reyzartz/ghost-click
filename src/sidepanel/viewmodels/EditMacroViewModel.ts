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

  updateMacroName(newName: string): void {
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

    const updatedMacro = { ...this.state.macro, name: trimmedName };

    this.setState({ macro: updatedMacro });
  }

  updateStepName(stepId: string, newName: string): void {
    if (!this.state.macro) {
      this.logger.error("Cannot update step: no macro loaded");
      return;
    }

    const trimmedName = newName.trim();

    if (!trimmedName) {
      this.logger.warn("Step name cannot be empty");
      return;
    }

    this.logger.info("Updating step name", {
      macroId: this.state.macro.id,
      stepId,
      newName: trimmedName,
    });

    const updatedSteps = this.state.macro.steps.map((step) =>
      step.id === stepId ? { ...step, name: trimmedName } : step
    );

    const updatedMacro = { ...this.state.macro, steps: updatedSteps };
    this.setState({ macro: updatedMacro });
  }

  async updateMacro(macro: Macro): Promise<void> {
    this.logger.info("Updating macro", { macroId: macro.id });
    this.setState({ loading: true, error: null, success: false });

    try {
      await this.macroRepository.save(macro);

      this.setState({
        loading: false,
        macro,
        success: true,
        error: null,
      });

      this.logger.info("Updated macro", { macroId: macro.id });
    } catch (err) {
      this.logger.error("Failed to update macro", { macroId: macro.id, err });
      this.setState({
        loading: false,
        error: "Failed to update macro",
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
