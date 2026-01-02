import { Macro, MacroStep } from "@/models";
import { MacroRepository } from "@/repositories/MacroRepository";
import { PlaybackStateRepository } from "@/repositories/PlaybackStateRepository";
import { BaseViewModel } from "@/utils/BaseViewModel";
import { Emitter } from "@/utils/Emitter";

export interface StepError {
  stepId: string;
  stepName: string;
  stepType: string;
  error: string;
}

export interface PlaybackProgressState {
  isPlaying: boolean;
  macro: Macro | null;
  currentStepId: string | null;
  currentStepIndex: number;
  totalSteps: number;
  error?: string | null;
  erroredStepIds: string[];
  errorDetails: StepError[];
}

export class PlaybackProgressViewModel extends BaseViewModel {
  private state: PlaybackProgressState = {
    isPlaying: false,
    macro: null,
    currentStepId: null,
    currentStepIndex: 0,
    totalSteps: 0,
    error: null,
    erroredStepIds: [],
    errorDetails: [],
  };
  private listeners: Array<(state: PlaybackProgressState) => void> = [];

  constructor(
    private readonly macroRepository: MacroRepository,
    private readonly playbackStateRepository: PlaybackStateRepository,
    protected readonly emitter: Emitter
  ) {
    super("PlaybackProgressViewModel", emitter);
  }

  async init(): Promise<void> {
    this.logger.info("Initializing playback progress view model");

    await this.loadPlaybackState();

    // Listen for playback events
    this.emitter.on("PLAY_MACRO", (data) => {
      this.logger.info("Play macro event received", { macroId: data.macroId });
      this.setState({ error: null, erroredStepIds: [], errorDetails: [] });

      setTimeout(() => {
        void this.loadPlaybackState();
      }, 100);
    });

    this.emitter.on("PLAYBACK_COMPLETED", () => {
      this.logger.info("Playback completed event received");
      this.setState({
        isPlaying: false,
        currentStepId: null,
        currentStepIndex: this.state.totalSteps,
      });
    });

    this.emitter.on("PLAYBACK_ERROR", (data) => {
      void this.handlePlaybackError(data);
    });

    this.emitter.on("EXECUTE_ACTION", (data) => {
      void this.updateCurrentStep(data.step.id);
    });

    this.emitter.on("STOP_PLAYBACK", () => {
      this.logger.info("Stop playback event received");
      this.setState({ isPlaying: false });
    });
  }

  subscribe(listener: (state: PlaybackProgressState) => void): () => void {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private setState(next: Partial<PlaybackProgressState>): void {
    this.state = { ...this.state, ...next };
    this.listeners.forEach((l) => l(this.state));
  }

  private async loadPlaybackState(): Promise<void> {
    try {
      const playbackState = await this.playbackStateRepository.get();

      if (playbackState?.isPlaying && playbackState.macroId) {
        const macro = await this.macroRepository.findById(
          playbackState.macroId
        );

        if (macro) {
          const currentStepIndex = this.findStepIndex(
            macro.steps,
            playbackState.currentStepId
          );

          this.setState({
            isPlaying: true,
            macro,
            currentStepId: playbackState.currentStepId,
            currentStepIndex,
            totalSteps: macro.steps.length,
            error: null,
            erroredStepIds: [],
            errorDetails: [],
          });

          this.logger.info("Loaded playback state", {
            macroId: macro.id,
            currentStepIndex,
            totalSteps: macro.steps.length,
          });
        }
      } else {
        this.setState({
          isPlaying: false,
          macro: null,
          currentStepId: null,
          currentStepIndex: 0,
          totalSteps: 0,
          erroredStepIds: [],
          errorDetails: [],
        });
      }
    } catch (err) {
      this.logger.error("Failed to load playback state", { err });
      this.setState({ error: "Failed to load playback state" });
    }
  }

  private async handlePlaybackError(data: any): Promise<void> {
    this.logger.error("Playback error event received", { error: data.error });
    const erroredStepIds = data?.stepId
      ? Array.from(new Set([...this.state.erroredStepIds, data.stepId]))
      : this.state.erroredStepIds;

    const errorDetails = [...this.state.errorDetails];
    if (data?.stepId && this.state.macro) {
      const step = this.state.macro.steps.find((s) => s.id === data.stepId);
      if (step) {
        errorDetails.push({
          stepId: step.id,
          stepName: step.name,
          stepType: step.type,
          error: data.error || "Unknown error",
        });
      }
    }

    try {
      const playbackState = await this.playbackStateRepository.get();
      const errorSummary =
        errorDetails.length > 0
          ? `${errorDetails.length} step${
              errorDetails.length === 1 ? "" : "s"
            } failed`
          : data?.error || "Playback failed";
      this.setState({
        isPlaying: Boolean(playbackState?.isPlaying),
        error: errorSummary,
        erroredStepIds,
        errorDetails,
      });
    } catch {
      const errorSummary =
        errorDetails.length > 0
          ? `${errorDetails.length} step${
              errorDetails.length === 1 ? "" : "s"
            } failed`
          : data?.error || "Playback failed";
      this.setState({
        error: errorSummary,
        erroredStepIds,
        errorDetails,
      });
    }
  }

  private async updateCurrentStep(currentStepId: string | null): Promise<void> {
    try {
      if (currentStepId !== this.state.currentStepId && this.state.macro) {
        const currentStepIndex = this.findStepIndex(
          this.state.macro.steps,
          currentStepId
        );

        this.setState({
          currentStepId,
          currentStepIndex,
        });
      }
    } catch (err) {
      this.logger.error("Failed to update current step", { err });
    }
  }

  private findStepIndex(steps: MacroStep[], stepId: string | null): number {
    if (!stepId) return 0;
    const index = steps.findIndex((step) => step.id === stepId);
    return index >= 0 ? index : 0;
  }

  getCurrentStep(): MacroStep | null {
    if (
      !this.state.macro ||
      this.state.currentStepIndex >= this.state.macro.steps.length
    ) {
      return null;
    }
    return this.state.macro.steps[this.state.currentStepIndex];
  }

  clearErrors(): void {
    this.setState({ error: null, erroredStepIds: [], errorDetails: [] });
  }
}
