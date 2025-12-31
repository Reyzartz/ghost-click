import { Macro, MacroStep } from "@/models";
import { MacroRepository } from "@/repositories/MacroRepository";
import { BaseService } from "../../utils/BaseService";
import { Emitter } from "@/utils/Emitter";
import { UserActionEvent } from "@/utils/Event";

export class RecorderService extends BaseService {
  private isRecording = false;
  private currentSessionId: string | null = null;
  private macroSteps: MacroStep[] = [];

  constructor(
    protected readonly emitter: Emitter,
    private readonly macroRepository: MacroRepository
  ) {
    super("RecorderService", emitter);
  }

  init(): void {
    this.logger.info("RecorderService initialized");

    this.emitter.on("START_RECORDING", (data) => {
      this.startRecording(data.sessionId);
    });

    this.emitter.on("STOP_RECORDING", () => {
      void this.stopRecording();
    });

    this.emitter.on("USER_ACTION", (data) => {
      this.recordUserAction(data);
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

    this.macroSteps = [];
  }

  private async stopRecording(): Promise<void> {
    if (!this.isRecording) {
      this.logger.warn("No recording in progress");
      return;
    }

    if (!this.currentSessionId) {
      this.logger.warn("Missing session id while stopping recording");
      this.isRecording = false;
      this.macroSteps = [];
      return;
    }

    this.logger.info("Recording stopped", { sessionId: this.currentSessionId });
    this.isRecording = false;
    const sessionId = this.currentSessionId;
    this.currentSessionId = null;

    await this.saveMacro(sessionId, this.macroSteps);
    this.macroSteps = [];
  }

  private async saveMacro(
    sessionId: string,
    steps: MacroStep[]
  ): Promise<void> {
    const now = Date.now();
    const existing = await this.macroRepository.findById(sessionId);

    const macro: Macro = {
      id: sessionId,
      name: existing?.name ?? sessionId,
      steps: [...steps],
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    await this.macroRepository.save(macro);
    this.logger.info("Saved macro after recording stop", {
      id: macro.id,
      steps: macro.steps.length,
    });
  }

  private recordUserAction(data: UserActionEvent["data"]): void {
    if (!this.isRecording) {
      this.logger.warn("No recording in progress. Ignoring user action.");
      return;
    }

    this.logger.info(`Recording user "${data.type}" action`, { data });

    switch (data.type) {
      case "CLICK":
        this.recordClickAction(data);
        break;
      default:
        this.logger.warn("Unknown user action type", { type: data.type });
    }
  }

  private recordClickAction(data: UserActionEvent["data"]): void {
    const step: MacroStep = {
      type: "CLICK",
      target: data.target,
      timestamp: data.timestamp,
    };

    this.macroSteps.push(step);
    this.logger.info("Recorded click action", { step });

    // TODO: Optionally emit an event or save the step immediately
  }
}
