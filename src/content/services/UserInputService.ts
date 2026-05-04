import { BaseService } from "@/utils/BaseService";
import { Emitter } from "@/utils/Emitter";
import { RecordingStateRepository } from "@/repositories/RecordingStateRepository";
import { SettingsRepository } from "@/repositories/SettingsRepository";
import { ElementSelector } from "@/utils/ElementSelector";
import { MacroUtils } from "@/utils/MacroUtils";

export class UserInputService extends BaseService {
  private isRecording = false;
  private currentSessionId: string | null = null;
  private clickHandler: ((event: MouseEvent) => void) | null = null;
  private inputHandler: ((event: Event) => void) | null = null;
  private keydownHandler: ((event: KeyboardEvent) => void) | null = null;

  constructor(
    protected readonly emitter: Emitter,
    private readonly recordingStateRepository: RecordingStateRepository,
    private readonly settingsRepository: SettingsRepository
  ) {
    super("UserInputService", emitter);
  }

  async init(): Promise<void> {
    this.logger.info("UserInputService initialized");

    await this.setInitialRecordingState();

    this.emitter.on("START_RECORDING", (data) => {
      void this.startCapture(data.sessionId);
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
      void this.captureClick(event);
    };

    this.inputHandler = (event: Event) => {
      void this.captureInput(event);
    };

    this.keydownHandler = (event: KeyboardEvent) => {
      void this.captureKeyPress(event);
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

  private getElementName(element: HTMLElement): string {
    const text = element.textContent;
    if (text) {
      return text;
    }

    return element.tagName.toLowerCase();
  }

  private async captureClick(event: MouseEvent): Promise<void> {
    if (!this.isRecording || !this.currentSessionId) {
      return;
    }

    // TODO: Capture click on element in which the click handler is attached
    const target = event.target as HTMLElement;
    this.logger.info("Captured click on element", { element: target });

    const settings = await this.settingsRepository.get();

    const clickStep = MacroUtils.createClickStep(settings, {
      name: MacroUtils.getStepName(this.getElementName(target), "CLICK"),
      target: ElementSelector.getElementSelector(
        target,
        settings.defaultSelectorType
      ),
    });

    this.logger.info("Click captured", clickStep);

    // Emit USER_ACTION event
    this.emitter.emit("USER_ACTION", {
      sessionId: this.currentSessionId,
      step: clickStep,
    });
  }

  private async captureInput(event: Event): Promise<void> {
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

    const settings = await this.settingsRepository.get();

    const inputStep = MacroUtils.createInputStep(settings, {
      name: MacroUtils.getStepName(target.value, "INPUT"),
      target: ElementSelector.getElementSelector(
        target,
        settings.defaultSelectorType
      ),
      value: target.value,
    });

    this.logger.info("Input captured", inputStep);

    // Emit USER_ACTION event
    this.emitter.emit("USER_ACTION", {
      sessionId: this.currentSessionId,
      step: inputStep,
    });
  }

  private async captureKeyPress(event: KeyboardEvent): Promise<void> {
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

    const settings = await this.settingsRepository.get();

    const keyPressStep = MacroUtils.createKeyPressStep(settings, {
      name: MacroUtils.getStepName(event.key, "KEYPRESS"),
      target: ElementSelector.getElementSelector(
        target,
        settings.defaultSelectorType
      ),
      key: event.key,
      code: event.code,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey,
      altKey: event.altKey,
      metaKey: event.metaKey,
    });

    this.logger.info("KeyPress captured", keyPressStep);

    // Emit USER_ACTION event
    this.emitter.emit("USER_ACTION", {
      sessionId: this.currentSessionId,
      step: keyPressStep,
    });
  }
}
