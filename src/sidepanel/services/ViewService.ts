import { BaseService } from "@/utils/BaseService";
import { Emitter } from "@/utils/Emitter";
import { PlaybackStateRepository } from "@/repositories/PlaybackStateRepository";
import { RecordingStateRepository } from "@/repositories/RecordingStateRepository";

export type SidePanelView =
  | "macroList"
  | "playbackProgress"
  | "recordingProgress"
  | "editMacro"
  | "settings";

export interface ViewState {
  currentView: SidePanelView;
}

export class ViewService extends BaseService {
  private state: ViewState = {
    currentView: "macroList",
  };
  private listeners: Array<(state: ViewState) => void> = [];

  constructor(
    protected readonly emitter: Emitter,
    private readonly playbackStateRepository: PlaybackStateRepository,
    private readonly recordingStateRepository: RecordingStateRepository
  ) {
    super("ViewService", emitter);
  }

  async init(): Promise<void> {
    this.logger.info("ViewService initialized");

    // Check if playback or recording is already in progress on startup
    await this.checkPlaybackState();
    await this.checkRecordingState();

    // Listen for recording events to switch views
    this.emitter.on("START_RECORDING", () => {
      this.logger.info(
        "Start recording event - switching to recording progress view"
      );
      this.navigateToView("recordingProgress");
    });

    this.emitter.on("SAVE_RECORDING_CONFIRMED", () => {
      this.logger.info("Recording saved - switching back to macro list view");
      this.navigateToView("macroList");
    });

    this.emitter.on("SAVE_RECORDING_CANCELLED", () => {
      this.logger.info(
        "Recording cancelled - switching back to macro list view"
      );
      this.navigateToView("macroList");
    });

    // Listen for playback events to switch views
    this.emitter.on("PLAY_MACRO", () => {
      this.logger.info(
        "Play macro event - switching to playback progress view"
      );
      this.navigateToView("playbackProgress");
    });

    this.emitter.on("PLAYBACK_COMPLETED", () => {
      this.logger.info(
        "Playback completed - staying on playback progress view"
      );
    });

    this.emitter.on("PLAYBACK_ERROR", () => {
      this.logger.info("Playback error - staying on playback progress view");
    });

    this.emitter.on("EDIT_MACRO", () => {
      this.logger.info("Edit macro event - switching to edit macro view");
      this.navigateToView("editMacro");
    });

    this.emitter.on("CREATE_MACRO", () => {
      this.logger.info("Create macro event - switching to edit macro view");
      this.navigateToView("editMacro");
    });
  }

  subscribe(listener: (state: ViewState) => void): () => void {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  navigateToView(view: SidePanelView): void {
    if (this.state.currentView !== view) {
      this.logger.info("Navigating to view", {
        from: this.state.currentView,
        to: view,
      });
      this.setState({ currentView: view });
    }
  }

  getCurrentView(): SidePanelView {
    return this.state.currentView;
  }

  private async checkPlaybackState(): Promise<void> {
    try {
      const playbackState = await this.playbackStateRepository.get();

      if (playbackState?.isPlaying) {
        this.logger.info(
          "Playback in progress - showing playback progress view"
        );
        this.setState({ currentView: "playbackProgress" });
      }
    } catch (err) {
      this.logger.error("Failed to check playback state", { err });
    }
  }

  private async checkRecordingState(): Promise<void> {
    try {
      const recordingState = await this.recordingStateRepository.get();

      if (recordingState?.isRecording) {
        this.logger.info(
          "Recording in progress - showing recording progress view"
        );
        this.setState({ currentView: "recordingProgress" });
      }
    } catch (err) {
      this.logger.error("Failed to check recording state", { err });
    }
  }

  private setState(next: Partial<ViewState>): void {
    this.state = { ...this.state, ...next };
    this.listeners.forEach((l) => l(this.state));
  }
}
