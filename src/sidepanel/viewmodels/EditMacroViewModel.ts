import { Macro, MacroStep } from "@/models";
import { MacroRepository } from "@/repositories/MacroRepository";
import { PlaybackStateRepository } from "@/repositories/PlaybackStateRepository";
import { BaseViewModel } from "@/utils/BaseViewModel";
import { Emitter } from "@/utils/Emitter";
import {
  CreateMacroEvent,
  EditMacroEvent,
  PlaybackErrorEvent,
} from "@/utils/Event";

export interface EditMacroState {
  loading: boolean;
  macro: Macro | null;
  error?: string | null;
  success?: boolean;
  deletedStepIds: Set<string>;
  newStepIds: Set<string>;
  isPlaying: boolean;
  isPaused: boolean;
  currentStepId: string | null;
  erroredStepIds: string[];
  completedStepIds: string[];
  isCreating: boolean;
}

export class EditMacroViewModel extends BaseViewModel {
  private state: EditMacroState = {
    loading: false,
    macro: null,
    error: null,
    success: false,
    deletedStepIds: new Set(),
    newStepIds: new Set(),
    isPlaying: false,
    isPaused: false,
    currentStepId: null,
    erroredStepIds: [],
    completedStepIds: [],
    isCreating: false,
  };
  private listeners: Array<(state: EditMacroState) => void> = [];

  constructor(
    private readonly macroRepository: MacroRepository,
    private readonly playbackStateRepository: PlaybackStateRepository,
    protected readonly emitter: Emitter
  ) {
    super("EditMacroViewModel", emitter);
  }

  async init(): Promise<void> {
    this.logger.info("Initializing edit macro view model");

    this.setState({
      isPlaying: await this.playbackStateRepository.isPlaying(),
      isPaused: await this.playbackStateRepository.isPaused(),
      currentStepId: await this.playbackStateRepository.getCurrentStepId(),
    });

    this.emitter.on("EXECUTE_ACTION", (data: { step: MacroStep }) => {
      this.logger.info("Detected EXECUTE_ACTION event", {
        stepId: data.step.id,
      });
      this.setState({
        currentStepId: data.step.id,
        completedStepIds: this.state.currentStepId
          ? [...this.state.completedStepIds, this.state.currentStepId]
          : this.state.completedStepIds,
      });
    });

    this.emitter.on("PLAYBACK_ERROR", (data: PlaybackErrorEvent["data"]) => {
      this.logger.info("Detected PLAYBACK_ERROR event", {
        stepId: data.stepId,
      });
      this.setState({
        currentStepId: null,
        erroredStepIds: data.stepId
          ? [...this.state.erroredStepIds, data.stepId]
          : this.state.erroredStepIds,
      });
    });

    this.emitter.on("PLAYBACK_COMPLETED", () => {
      this.logger.info("Detected PLAYBACK_COMPLETED event");
      this.setState({
        currentStepId: null,
        completedStepIds:
          this.state.currentStepId &&
          !this.state.erroredStepIds.includes(this.state.currentStepId)
            ? [...this.state.completedStepIds, this.state.currentStepId]
            : this.state.completedStepIds,
        isPlaying: false,
        isPaused: false,
      });
    });

    this.emitter.on("STOP_PLAYBACK", () => {
      this.logger.info("Detected STOP_PLAYBACK event; updating state");
      this.setState({
        isPlaying: false,
        isPaused: false,
        currentStepId: null,
        erroredStepIds: [],
        completedStepIds: [],
      });
    });

    this.emitter.on("PLAY_MACRO_PREVIEW", () => {
      this.logger.info("Detected PLAY_MACRO_PREVIEW event; updating state");
      this.setState({
        isPlaying: true,
        isPaused: false,
        currentStepId: null,
        erroredStepIds: [],
        completedStepIds: [],
      });
    });

    this.emitter.on("PAUSE_PLAYBACK", () => {
      this.logger.info("Detected PAUSE_PLAYBACK event; updating state");
      this.setState({ isPaused: true });
    });

    this.emitter.on("RESUME_PLAYBACK", () => {
      this.logger.info("Detected RESUME_PLAYBACK event; updating state");
      this.setState({ isPaused: false });
    });

    this.emitter.on("EDIT_MACRO", (data: EditMacroEvent["data"]) => {
      this.logger.info("Detected EDIT_MACRO event", { macroId: data.macroId });
      void this.loadMacro(data.macroId);
    });

    this.emitter.on("CREATE_MACRO", (data: CreateMacroEvent["data"]) => {
      this.logger.info("Detected CREATE_MACRO event", {
        macroId: data.macro.id,
      });
      this.loadMacroForCreation(data.macro);
    });
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
    this.setState({
      loading: true,
      error: null,
      success: false,
      isCreating: false,
    });

    try {
      const macro = await this.macroRepository.findById(macroId);

      if (!macro) {
        this.logger.error("Macro not found", { macroId });
        this.setState({
          loading: false,
          error: "Macro not found",
          macro: null,
          isCreating: false,
        });
        return;
      }

      this.setState({ loading: false, macro, error: null, isCreating: false });
      this.logger.info("Loaded macro for edit", { macroId, name: macro.name });
    } catch (err) {
      this.logger.error("Failed to load macro", { macroId, err });
      this.setState({
        loading: false,
        error: "Failed to load macro",
        macro: null,
        isCreating: false,
      });
    }
  }

  loadMacroForCreation(macro: Macro): void {
    this.logger.info("Loading macro for creation", {
      macroId: macro.id,
      name: macro.name,
    });
    this.setState({
      loading: false,
      macro,
      error: null,
      success: false,
      isCreating: true,
      deletedStepIds: new Set(),
      newStepIds: new Set(),
    });
  }

  updateMacroName(name: string): void {
    let error: string | null = null;
    if (!this.state.macro) {
      this.logger.error("Cannot update name: no macro loaded");
      this.setState({ error: "No macro loaded" });
      return;
    }

    if (!name.trim()) {
      error = "Macro name cannot be empty";
    }

    this.logger.info("Updating macro name", {
      macroId: this.state.macro.id,
      oldName: this.state.macro.name,
      newName: name,
    });

    const updatedMacro = { ...this.state.macro, name };

    this.setState({ macro: updatedMacro, error });
  }

  updateStep(stepId: string, step: Partial<MacroStep>): void {
    if (!this.state.macro) {
      this.logger.error("Cannot update step: no macro loaded");
      return;
    }

    this.logger.info("Updating step ", {
      macroId: this.state.macro.id,
      stepId,
      step,
    });

    const updatedSteps = this.state.macro.steps.map((s) =>
      s.id === stepId ? { ...s, ...step } : s
    );

    const updatedMacro = {
      ...this.state.macro,
      steps: updatedSteps as MacroStep[],
    };
    this.setState({ macro: updatedMacro });
  }

  updateStepDelay(stepId: string, newDelay: number): void {
    if (!this.state.macro) {
      this.logger.error("Cannot update step delay: no macro loaded");
      return;
    }

    if (newDelay < 0) {
      this.logger.warn("Step delay cannot be negative");
      return;
    }

    this.logger.info("Updating step delay", {
      macroId: this.state.macro.id,
      stepId,
      newDelay,
    });

    const updatedSteps = this.state.macro.steps.map((step) =>
      step.id === stepId ? { ...step, delay: newDelay } : step
    );

    const updatedMacro = { ...this.state.macro, steps: updatedSteps };
    this.setState({ macro: updatedMacro });
  }

  addStep(newStep: MacroStep, position: number): void {
    if (!this.state.macro) {
      this.logger.error("Cannot add step: no macro loaded");
      return;
    }

    this.logger.info("Adding new step", {
      macroId: this.state.macro.id,
      stepType: newStep.type,
    });

    const updatedSteps = [
      ...this.state.macro.steps.slice(0, position),
      newStep,
      ...this.state.macro.steps.slice(position),
    ];

    const newStepIds = new Set(this.state.newStepIds);
    newStepIds.add(newStep.id);

    const updatedMacro = { ...this.state.macro, steps: updatedSteps };
    this.setState({ macro: updatedMacro, newStepIds });
  }

  deleteStep(stepId: string): void {
    if (!this.state.macro) {
      this.logger.error("Cannot delete step: no macro loaded");
      return;
    }

    this.logger.info("Marking step for deletion", {
      macroId: this.state.macro.id,
      stepId,
    });

    if (this.isStepNew(stepId)) {
      const updatedSteps = this.state.macro.steps.filter(
        (step) => step.id !== stepId
      );

      const newStepIds = new Set(this.state.newStepIds);
      newStepIds.delete(stepId);

      const updatedMacro = { ...this.state.macro, steps: updatedSteps };
      this.setState({ macro: updatedMacro, newStepIds });
      return;
    }

    const deletedStepIds = new Set(this.state.deletedStepIds);
    deletedStepIds.add(stepId);

    this.setState({ deletedStepIds });
  }

  undoDeleteStep(stepId: string): void {
    if (!this.state.macro) {
      this.logger.error("Cannot undo: no macro loaded");
      return;
    }

    this.logger.info("Undoing delete step", {
      macroId: this.state.macro.id,
      stepId,
    });

    const deletedStepIds = new Set(this.state.deletedStepIds);
    deletedStepIds.delete(stepId);

    this.setState({ deletedStepIds });
  }

  isStepDeleted(stepId: string): boolean {
    return this.state.deletedStepIds.has(stepId);
  }

  isStepNew(stepId: string): boolean {
    return this.state.newStepIds.has(stepId);
  }

  async updateMacro(macro: Macro): Promise<void> {
    this.logger.info("Updating macro", { macroId: macro.id });
    this.setState({ loading: true, error: null, success: false });

    try {
      // Filter out deleted steps before saving
      const filteredSteps = macro.steps.filter(
        (step) => !this.state.deletedStepIds.has(step.id)
      );
      const macroToSave = { ...macro, steps: filteredSteps };

      await this.macroRepository.save(macroToSave);

      this.setState({
        loading: false,
        macro: macroToSave,
        success: true,
        error: null,
        deletedStepIds: new Set(),
        newStepIds: new Set(),
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
      isCreating: false,
      deletedStepIds: new Set(),
      newStepIds: new Set(),
    });
  }
}
