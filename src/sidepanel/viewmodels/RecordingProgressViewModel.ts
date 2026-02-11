import { MacroStep } from "@/models";
import { RecordingStateRepository } from "@/repositories/RecordingStateRepository";
import { BaseViewModel } from "@/utils/BaseViewModel";
import { Emitter } from "@/utils/Emitter";

export interface RecordingProgressState {
  loading: boolean;
  isRecording: boolean;
  sessionId: string | null;
  steps: MacroStep[];
  error?: string | null;
}

export class RecordingProgressViewModel extends BaseViewModel {
  private state: RecordingProgressState = {
    loading: true,
    isRecording: false,
    sessionId: null,
    steps: [],
    error: null,
  };
  private listeners: Array<(state: RecordingProgressState) => void> = [];

  constructor(
    private readonly recordingStateRepository: RecordingStateRepository,
    protected readonly emitter: Emitter
  ) {
    super("RecordingProgressViewModel", emitter);
  }

  async init(): Promise<void> {
    this.logger.info("Initializing recording progress view model");

    // Load initial recording state
    await this.loadRecordingState();

    // Listen for recording start
    this.emitter.on("START_RECORDING", (data) => {
      this.logger.info("Recording started", { sessionId: data.sessionId });
      this.setState({
        isRecording: true,
        sessionId: data.sessionId,
        steps: [],
        error: null,
        loading: false,
      });
    });

    // Listen for user actions (steps being recorded)
    this.emitter.on("USER_ACTION", () => {
      void this.userAddedStep();
    });

    // Listen for recording stop
    this.emitter.on("STOP_RECORDING", () => {
      this.logger.info("Recording stopped");
      this.setState({
        isRecording: false,
      });
    });

    // Listen for save recording cancelled
    this.emitter.on("SAVE_RECORDING_CANCELLED", () => {
      this.logger.info("Recording cancelled, clearing state");
      this.setState({
        isRecording: false,
        sessionId: null,
        steps: [],
      });
    });

    // Listen for save recording confirmed
    this.emitter.on("SAVE_RECORDING_CONFIRMED", () => {
      this.logger.info("Recording saved, clearing state");
      this.setState({
        isRecording: false,
        sessionId: null,
        steps: [],
      });
    });
  }

  subscribe(listener: (state: RecordingProgressState) => void): () => void {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
  async userAddedStep(): Promise<void> {
    // Add a slight delay to ensure the recording state has been updated in the repository
    await new Promise((resolve) => setTimeout(resolve, 50));

    const recordingState = await this.recordingStateRepository.get();

    if (!recordingState || !recordingState.macro) {
      this.logger.error("No recording state found when adding step");
      return;
    }

    this.setState({
      steps: recordingState.macro.steps,
    });
  }

  async loadRecordingState(): Promise<void> {
    try {
      this.setState({ loading: true });
      const recordingState = await this.recordingStateRepository.get();

      if (recordingState?.isRecording && recordingState.macro) {
        this.logger.info("Loaded recording state", {
          sessionId: recordingState.sessionId,
          stepsCount: recordingState.macro.steps.length,
        });
        this.setState({
          isRecording: true,
          sessionId: recordingState.sessionId,
          steps: recordingState.macro.steps,
          loading: false,
        });
      } else {
        this.setState({
          loading: false,
        });
      }
    } catch (err) {
      this.logger.error("Failed to load recording state", { err });
      this.setState({
        loading: false,
        error: "Failed to load recording state",
      });
    }
  }

  updateStep(stepId: string, updates: Partial<MacroStep>): void {
    this.logger.info("Updating step", { stepId, updates });
    this.setState({
      steps: this.state.steps.map((step) =>
        step.id === stepId ? ({ ...step, ...updates } as MacroStep) : step
      ),
    });
  }

  deleteStep(stepId: string): void {
    this.logger.info("Deleting step", { stepId });
    this.setState({
      steps: this.state.steps.filter((step) => step.id !== stepId),
    });
  }

  private setState(updates: Partial<RecordingProgressState>): void {
    this.state = { ...this.state, ...updates };
    this.listeners.forEach((listener) => listener(this.state));
  }
}
