import { BaseViewModel } from "@/utils/BaseViewModel";
import { Emitter } from "@/utils/Emitter";
import { RecordingStateRepository } from "@/repositories/RecordingStateRepository";
import { PlaybackStateRepository } from "@/repositories/PlaybackStateRepository";

export type AppStatus = "idle" | "recording" | "playing";

export interface StatusIndicatorState {
  status: AppStatus;
}

export class StatusIndicatorViewModel extends BaseViewModel {
  private state: StatusIndicatorState = { status: "idle" };
  private listeners: Array<(state: StatusIndicatorState) => void> = [];

  constructor(
    protected readonly emitter: Emitter,
    private readonly recordingStateRepository: RecordingStateRepository,
    private readonly playbackStateRepository: PlaybackStateRepository
  ) {
    super("StatusIndicatorViewModel", emitter);
  }

  async init(): Promise<void> {
    this.logger.info("Initializing status indicator view model");

    // Restore status from recording state
    const recordingState = await this.recordingStateRepository.get();
    if (recordingState?.isRecording) {
      this.logger.info("Restoring recording status");
      this.updateStatus("recording");
    }

    // Restore status from playback state
    const playbackState = await this.playbackStateRepository.get();
    if (playbackState?.isPlaying) {
      this.logger.info("Restoring playback status");
      this.updateStatus("playing");
    }

    this.emitter.on("START_RECORDING", () => {
      this.updateStatus("recording");
    });

    this.emitter.on("STOP_RECORDING", () => {
      this.updateStatus("idle");
    });

    this.emitter.on("PLAY_MACRO", () => {
      this.updateStatus("playing");
    });

    this.emitter.on("PLAYBACK_COMPLETED", () => {
      this.updateStatus("idle");
    });

    this.emitter.on("PLAYBACK_ERROR", () => {
      this.updateStatus("idle");
    });
  }

  subscribe(listener: (state: StatusIndicatorState) => void): () => void {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private setState(next: Partial<StatusIndicatorState>): void {
    this.state = { ...this.state, ...next };
    this.listeners.forEach((l) => l(this.state));
  }

  private updateStatus(status: AppStatus): void {
    if (this.state.status === status) return;
    this.logger.info("Updating status", {
      from: this.state.status,
      to: status,
    });
    this.setState({ status });
  }
}
