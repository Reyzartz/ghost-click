import { BaseService } from "@/utils/BaseService";
import { Emitter } from "@/utils/Emitter";
import {
  UserClickEventData,
  UserInputEventData,
  UserKeyPressEventData,
} from "@/utils/Event";
import { RecordingStateRepository } from "@/repositories/RecordingStateRepository";
import { ElementSelector } from "@/utils/ElementSelector";

export class UserInputService extends BaseService {
  private isRecording = false;
  private currentSessionId: string | null = null;
  private clickHandler: ((event: MouseEvent) => void) | null = null;
  private inputHandler: ((event: Event) => void) | null = null;
  private keydownHandler: ((event: KeyboardEvent) => void) | null = null;

  constructor(
    protected readonly emitter: Emitter,
    private readonly recordingStateRepository: RecordingStateRepository
  ) {
    super("UserInputService", emitter);
  }

  async init(): Promise<void> {
    this.logger.info("UserInputService initialized");

    await this.setInitialRecordingState();

    this.emitter.on("START_RECORDING", (data) => {
      this.startCapture(data.sessionId);
    });

    this.emitter.on("STOP_RECORDING", () => {
      this.stopCapture();
    });
  }

  private async setInitialRecordingState(): Promise<void> {
    const recordingState = await this.recordingStateRepository.get();

    if (recordingState?.isRecording && recordingState.sessionId) {
      this.isRecording = true;
      this.currentSessionId = recordingState.sessionId;
      this.logger.info("Restored recording state, starting capture", {
        sessionId: this.currentSessionId,
      });
      this.addClickHandlers();
    }
  }

  private startCapture(sessionId: string): void {
    if (this.isRecording) {
      this.logger.warn("Already capturing user input");
      return;
    }

    this.isRecording = true;
    this.currentSessionId = sessionId;
    this.logger.info("Started capturing user input", { sessionId });

    this.addClickHandlers();
  }

  private readonly addClickHandlers = (): void => {
    this.clickHandler = (event: MouseEvent) => {
      this.captureClick(event);
    };

    this.inputHandler = (event: Event) => {
      this.captureInput(event);
    };

    this.keydownHandler = (event: KeyboardEvent) => {
      this.captureKeyPress(event);
    };

    document.addEventListener("click", this.clickHandler, true);
    document.addEventListener("input", this.inputHandler, true);
    document.addEventListener("keydown", this.keydownHandler, true);
  };

  private readonly removeClickHandlers = (): void => {
    if (this.clickHandler) {
      document.removeEventListener("click", this.clickHandler, true);
      this.clickHandler = null;
    }
    if (this.inputHandler) {
      document.removeEventListener("input", this.inputHandler, true);
      this.inputHandler = null;
    }
    if (this.keydownHandler) {
      document.removeEventListener("keydown", this.keydownHandler, true);
      this.keydownHandler = null;
    }
  };

  private stopCapture(): void {
    if (!this.isRecording) {
      this.logger.warn("Not currently capturing");
      return;
    }

    this.logger.info("Stopped capturing user input", {
      sessionId: this.currentSessionId,
    });

    this.removeClickHandlers();

    this.isRecording = false;
    this.currentSessionId = null;
  }

  private generateStepId(): string {
    return crypto.randomUUID();
  }

  private getElementName(element: HTMLElement): string {
    const text = element.textContent;
    if (text) {
      return text;
    }

    return element.tagName.toLowerCase();
  }

  private captureClick(event: MouseEvent): void {
    if (!this.isRecording || !this.currentSessionId) {
      return;
    }

    // TODO: Capture click on element in which the click handler is attached
    const target = event.target as HTMLElement;
    console.log("Captured click on element:", target);

    const clickData: UserClickEventData = {
      id: this.generateStepId(),
      name: this.getElementName(target),
      sessionId: this.currentSessionId,
      timestamp: Date.now(),
      type: "CLICK",
      target: ElementSelector.getElementSelector(target),
    };

    this.logger.info("Click captured", clickData);

    // Emit USER_ACTION event
    this.emitter.emit("USER_ACTION", clickData);
  }

  private captureInput(event: Event): void {
    if (!this.isRecording || !this.currentSessionId) {
      return;
    }

    const target = event.target as HTMLInputElement | HTMLTextAreaElement;

    // Only capture input from input and textarea elements
    if (
      !target ||
      (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA")
    ) {
      return;
    }

    const inputData: UserInputEventData = {
      id: this.generateStepId(),
      name: target.value,
      sessionId: this.currentSessionId,
      timestamp: Date.now(),
      type: "INPUT" as const,
      target: ElementSelector.getElementSelector(target),
      value: target.value,
    };

    this.logger.info("Input captured", inputData);

    // Emit USER_ACTION event
    this.emitter.emit("USER_ACTION", inputData);
  }

  private captureKeyPress(event: KeyboardEvent): void {
    if (!this.isRecording || !this.currentSessionId) {
      return;
    }

    // Only capture special keys (Enter, Backspace, Escape, Tab, etc.)
    const specialKeys = [
      "Enter",
      "Backspace",
      "Delete",
      "Escape",
      "Tab",
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
    ];

    if (!specialKeys.includes(event.key)) {
      return;
    }

    const target = event.target as HTMLElement;

    const keyPressData: UserKeyPressEventData = {
      id: this.generateStepId(),
      name: event.key,
      sessionId: this.currentSessionId,
      timestamp: Date.now(),
      type: "KEYPRESS" as const,
      target: ElementSelector.getElementSelector(target),
      key: event.key,
      code: event.code,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey,
      altKey: event.altKey,
      metaKey: event.metaKey,
    };

    this.logger.info("KeyPress captured", keyPressData);

    // Emit USER_ACTION event
    this.emitter.emit("USER_ACTION", keyPressData);
  }
}
