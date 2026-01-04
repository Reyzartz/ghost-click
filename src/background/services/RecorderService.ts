import { Macro, MacroStep, StepType } from "@/models";
import { MacroRepository } from "@/repositories/MacroRepository";
import { RecordingStateRepository } from "@/repositories/RecordingStateRepository";
import { BaseService } from "../../utils/BaseService";
import { Emitter } from "@/utils/Emitter";
import { UserActionEvent } from "@/utils/Event";

export class RecorderService extends BaseService {
  private isRecording = false;
  private currentSessionId: string | null = null;
  private initialUrl: string = "";
  private recordingTabId: number | null = null;
  private macroSteps: MacroStep[] = [];

  constructor(
    protected readonly emitter: Emitter,
    private readonly macroRepository: MacroRepository,
    private readonly recordingStateRepository: RecordingStateRepository
  ) {
    super("RecorderService", emitter);
  }

  async init(): Promise<void> {
    this.logger.info("RecorderService initialized");

    this.setInitialRecordingState();

    this.emitter.on("START_RECORDING", (data) => {
      this.startRecording(data.sessionId, data.initialUrl, data.tabId);
    });

    this.emitter.on("STOP_RECORDING", () => {
      void this.stopRecording();
    });

    this.emitter.on("USER_ACTION", (data) => {
      this.recordUserAction(data);
    });

    // Listen for tab close to stop recording
    chrome.tabs.onRemoved.addListener((tabId) => {
      if (this.isRecording && this.recordingTabId === tabId) {
        this.logger.info("Recording tab closed, stopping recording", { tabId });
        void this.stopRecording();
      }
    });
  }

  private async setInitialRecordingState(): Promise<void> {
    const recordingState = await this.recordingStateRepository.get();

    if (recordingState?.isRecording) {
      this.isRecording = true;
      this.currentSessionId = recordingState.sessionId;
      this.initialUrl = recordingState.initialUrl;
      this.recordingTabId = recordingState.tabId;
      this.macroSteps = recordingState.macroSteps || [];
      this.logger.info("Restored recording state from repository", {
        sessionId: this.currentSessionId,
        tabId: this.recordingTabId,
        stepsCount: this.macroSteps.length,
      });
    }
  }

  private startRecording(
    sessionId: string,
    initialUrl: string,
    tabId?: number
  ): void {
    if (this.isRecording) {
      this.logger.warn("Recording already in progress", {
        currentSessionId: this.currentSessionId,
      });
      return;
    }

    this.isRecording = true;
    this.currentSessionId = sessionId;
    this.initialUrl = initialUrl;
    this.recordingTabId = tabId ?? null;
    this.macroSteps = [];

    this.logger.info("Recording started", { sessionId, initialUrl, tabId });

    // Save recording state to repository
    void this.recordingStateRepository.save({
      isRecording: true,
      sessionId,
      initialUrl,
      tabId: this.recordingTabId,
      macroSteps: [],
    });
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
      this.initialUrl = "";
      this.recordingTabId = null;
      await this.recordingStateRepository.clear();
      return;
    }

    this.logger.info("Recording stopped", { sessionId: this.currentSessionId });
    this.isRecording = false;
    const sessionId = this.currentSessionId;
    const initialUrl = this.initialUrl;
    this.currentSessionId = null;
    this.initialUrl = "";
    this.recordingTabId = null;

    // Post-process steps to combine adjacent input events
    const processedSteps = this.postProcessSteps(this.macroSteps);

    await this.saveMacro(sessionId, initialUrl, processedSteps);
    this.macroSteps = [];

    // Clear recording state from repository
    await this.recordingStateRepository.clear();
  }

  private postProcessSteps(steps: MacroStep[]): MacroStep[] {
    if (steps.length === 0) return steps;

    const processed: MacroStep[] = [];
    let i = 0;

    while (i < steps.length) {
      const currentStep = steps[i];

      // If it's an INPUT step, look for adjacent INPUT steps with same xpath
      if (currentStep.type === "INPUT") {
        let lastInputStep = currentStep;
        let j = i + 1;

        // Find all adjacent INPUT steps with the same xpath
        while (
          j < steps.length &&
          steps[j].type === "INPUT" &&
          steps[j].target.xpath === currentStep.target.xpath
        ) {
          lastInputStep = steps[j] as typeof currentStep;
          j++;
        }

        // Add only the last input step (which has the final value)
        processed.push(lastInputStep);
        i = j;
      } else {
        // For non-INPUT steps, add as-is
        processed.push(currentStep);
        i++;
      }
    }

    this.logger.info("Post-processed steps", {
      original: steps.length,
      processed: processed.length,
    });

    return processed;
  }

  private async saveMacro(
    sessionId: string,
    initialUrl: string,
    steps: MacroStep[]
  ): Promise<void> {
    const now = Date.now();
    const existing = await this.macroRepository.findById(sessionId);

    // Extract domain from URL
    const domain = this.extractDomain(initialUrl);

    const macro: Macro = {
      id: sessionId,
      name: existing?.name ?? `Untitled Macro ${new Date().toLocaleString()}`,
      initialUrl,
      domain,
      steps: [...steps],
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    await this.macroRepository.save(macro);
    this.logger.info("Saved macro after recording stop", {
      id: macro.id,
      domain: macro.domain,
      steps: macro.steps.length,
    });
  }

  private extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return "unknown";
    }
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
      case "INPUT":
        this.recordInputAction(data);
        break;
      case "KEYPRESS":
        this.recordKeyPressAction(data);
        break;
      default:
        this.logger.warn("Unknown user action type");
    }
  }

  private recordClickAction(data: UserActionEvent["data"]): void {
    if (data.type !== "CLICK") return;

    const step: MacroStep = {
      id: data.id,
      name: RecorderService.getStepName(data.name, "CLICK"),
      type: "CLICK",
      target: data.target,
      timestamp: data.timestamp,
    };

    this.macroSteps.push(step);
    this.logger.info("Recorded click action", { step });

    // Save updated state to repository
    void this.recordingStateRepository.addStep(step);
  }

  private recordInputAction(data: UserActionEvent["data"]): void {
    if (data.type !== "INPUT") return;

    const step: MacroStep = {
      id: data.id,
      name: RecorderService.getStepName(data.value, "INPUT"),
      type: "INPUT",
      target: data.target,
      value: data.value,
      timestamp: data.timestamp,
    };

    this.macroSteps.push(step);
    this.logger.info("Recorded input action", { step });

    // Save updated state to repository
    void this.recordingStateRepository.addStep(step);
  }

  private recordKeyPressAction(data: UserActionEvent["data"]): void {
    if (data.type !== "KEYPRESS") return;

    const step: MacroStep = {
      id: data.id,
      name: RecorderService.getStepName(data.key, "KEYPRESS"),
      type: "KEYPRESS",
      target: data.target,
      key: data.key,
      code: data.code,
      ctrlKey: data.ctrlKey,
      shiftKey: data.shiftKey,
      altKey: data.altKey,
      metaKey: data.metaKey,
      timestamp: data.timestamp,
    };

    this.macroSteps.push(step);
    this.logger.info("Recorded keypress action", { step });

    // Save updated state to repository
    void this.recordingStateRepository.addStep(step);
  }

  private static getStepName(name: string, type: StepType): string {
    let displayName = "";
    switch (type) {
      case "CLICK":
        displayName = `Clicked "${name}"`;
        break;
      case "INPUT":
        displayName = `Typed "${name}"`;
        break;
      case "KEYPRESS":
        displayName = `Pressed "${name}"`;
        break;
    }
    return displayName.length > 30
      ? `${displayName.substring(0, 27)}...`
      : displayName;
  }
}
