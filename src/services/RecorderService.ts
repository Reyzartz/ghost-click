import { BaseService } from "./BaseService";
import { Emitter } from "@/utils/Emitter";

export class RecorderService extends BaseService {
  private isRecording = false;
  private currentSessionId: string | null = null;

  constructor(protected readonly emitter: Emitter) {
    super("RecorderService", emitter);
  }

  init(): void {
    this.logger.info("RecorderService initialized");

    this.emitter.on("START_RECORDING", (data) => {
      this.startRecording(data.sessionId);
    });

    this.emitter.on("STOP_RECORDING", () => {
      this.stopRecording();
    });
  }

  private startRecording(sessionId: string): void {
    if (this.isRecording) {
      this.logger.warn("Recording already in progress", {
        currentSessionId: this.currentSessionId,
      });
      return;
    }

    this.isRecording = true;
    this.currentSessionId = sessionId;
    this.logger.info("Recording started", { sessionId });

    // TODO: Implement actual recording logic
    // - Inject content script if needed
    // - Set up DOM event listeners
    // - Start capturing user actions
  }

  private stopRecording(): void {
    if (!this.isRecording) {
      this.logger.warn("No recording in progress");
      return;
    }

    this.logger.info("Recording stopped", { sessionId: this.currentSessionId });
    this.isRecording = false;
    this.currentSessionId = null;

    // TODO: Implement cleanup logic
    // - Remove event listeners
    // - Save recorded macro
    // - Notify user
  }
}
