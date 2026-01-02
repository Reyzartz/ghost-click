import { BaseService } from "@/utils/BaseService";
import { Emitter } from "@/utils/Emitter";
import { PlaybackStateRepository } from "@/repositories/PlaybackStateRepository";

export type SidePanelView = "macroList" | "playbackProgress";

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
    private readonly playbackStateRepository: PlaybackStateRepository
  ) {
    super("ViewService", emitter);
  }

  async init(): Promise<void> {
    this.logger.info("ViewService initialized");

    // Check if playback is already in progress on startup
    await this.checkPlaybackState();

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
      } else {
        this.logger.info("No playback in progress - showing macro list view");
        this.setState({ currentView: "macroList" });
      }
    } catch (err) {
      this.logger.error("Failed to check playback state", { err });
      this.setState({ currentView: "macroList" });
    }
  }

  private setState(next: Partial<ViewState>): void {
    this.state = { ...this.state, ...next };
    this.listeners.forEach((l) => l(this.state));
  }
}
