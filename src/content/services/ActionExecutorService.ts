import { BaseService } from "@/utils/BaseService";
import { Emitter } from "@/utils/Emitter";
import {
  ClickStep,
  InputStep,
  KeyPressStep,
  MacroStep,
  TargetElementSelector,
} from "@/models/MacroStep";
import { PlaybackStateRepository } from "@/repositories/PlaybackStateRepository";
import {
  ResolvableStepType,
  StepValidationError,
  TargetResolver,
} from "@/utils/TargetResolver";

export class ActionExecutorService extends BaseService {
  private overlay: HTMLDivElement | null = null;

  constructor(
    protected readonly emitter: Emitter,
    protected readonly playbackStateRepository: PlaybackStateRepository
  ) {
    super("ActionExecutorService", emitter);
  }

  async init(): Promise<void> {
    this.logger.info("ActionExecutorService initialized");

    this.emitter.on("EXECUTE_ACTION", (data) => {
      void this.handleExecuteAction(data.step);
    });

    return Promise.resolve();
  }

  private async handleExecuteAction(step: MacroStep): Promise<void> {
    try {
      this.logger.info(`Executing action: ${step.type}`, { step });

      switch (step.type) {
        case "CLICK":
          await this.executeClickStep(step);
          break;
        case "INPUT":
          await this.executeInputStep(step);
          break;
        case "KEYPRESS":
          await this.executeKeyPressStep(step);
          break;
        case "NAVIGATE":
          /**
           * Navigate is handled through the background script since it causes a page load.
           */
          break;
      }
    } catch (err) {
      const macroId = await this.playbackStateRepository.getMacroId();

      this.logger.error("Action execution failed", { error: err, step });

      if (!macroId) {
        this.logger.error(
          "No macroId found in playback state during error handling"
        );
        return;
      }

      this.emitter.emit("PLAYBACK_STEP_ERROR", {
        step,
        error: (err as Error).message,
      });
    }
  }

  private async executeClickStep(step: ClickStep): Promise<void> {
    const element = (await this.findElementWithRetry(
      step.target,
      "CLICK",
      step.retryCount,
      step.retryInterval
    )) as HTMLElement;

    this.logger.info("Clicking element", { selector: step.target });

    // Only scroll if element is not in view
    const isInView = await this.isElementInView(element);
    if (!isInView) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      await this.sleep(300);
    }

    this.highlightElement(element);

    element.click();
    element.focus();
  }

  private isElementInView(element: HTMLElement): Promise<boolean> {
    return new Promise((resolve) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          observer.disconnect();
          resolve(entry.isIntersecting);
        },
        {
          threshold: 0.8, // Element must be at least 80% visible
        }
      );

      observer.observe(element);
    });
  }

  private async findElementWithRetry(
    target: TargetElementSelector,
    stepType: ResolvableStepType,
    retryCount: number,
    retryInterval: number
  ): Promise<Element> {
    let attempts = 0;
    const maxAttempts = retryCount + 1; // Initial attempt + retries
    let lastFailureMessage = "";
    let lastFailureCode: StepValidationError["code"] = "NOT_FOUND";

    while (attempts < maxAttempts) {
      const result = TargetResolver.resolve(target, stepType);

      if (result.valid) {
        if (attempts > 0) {
          this.logger.info("Element resolved after retry", {
            attempt: attempts + 1,
            maxAttempts,
          });
        }
        return result.element;
      }

      lastFailureMessage = result.message;
      lastFailureCode = result.code;

      if (!result.retryable) {
        this.logger.error("Step validation failed (not retryable)", {
          code: result.code,
          message: result.message,
        });
        throw new StepValidationError(result.code, result.message);
      }

      attempts++;

      if (attempts < maxAttempts) {
        this.logger.info("Step not yet valid, retrying", {
          attempt: attempts,
          maxAttempts,
          code: result.code,
          retryInterval,
        });
        await this.sleep(retryInterval);
      }
    }

    this.logger.error("Step validation failed after all retries", {
      attempts: maxAttempts,
      code: lastFailureCode,
    });
    throw new StepValidationError(lastFailureCode, lastFailureMessage);
  }

  private async executeInputStep(step: InputStep): Promise<void> {
    const element = (await this.findElementWithRetry(
      step.target,
      "INPUT",
      step.retryCount,
      step.retryInterval
    )) as HTMLInputElement | HTMLTextAreaElement;

    this.logger.info("Setting input value", {
      selector: step.target,
      value: step.value,
    });

    // Only scroll if element is not in view
    const isInView = await this.isElementInView(element);
    if (!isInView) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      await this.sleep(300);
    }

    this.highlightElement(element);

    // Focus the element
    element.focus();

    // Set the value
    element.value = step.value;

    // Trigger input event to notify frameworks (React, Vue, etc.)
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }

  private async executeKeyPressStep(step: KeyPressStep): Promise<void> {
    const element = (await this.findElementWithRetry(
      step.target,
      "KEYPRESS",
      step.retryCount,
      step.retryInterval
    )) as HTMLElement;

    this.logger.info("Pressing key", { selector: step.target, key: step.key });

    // Only scroll if element is not in view
    const isInView = await this.isElementInView(element);
    if (!isInView) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      await this.sleep(300);
    }

    this.highlightElement(element);

    // Focus the element
    element.focus();

    // Dispatch keyboard events
    const keyboardEventInit: KeyboardEventInit = {
      key: step.key,
      code: step.code,
      ctrlKey: step.ctrlKey,
      shiftKey: step.shiftKey,
      altKey: step.altKey,
      metaKey: step.metaKey,
      bubbles: true,
      cancelable: true,
    };

    element.dispatchEvent(new KeyboardEvent("keydown", keyboardEventInit));
    element.dispatchEvent(new KeyboardEvent("keypress", keyboardEventInit));
    element.dispatchEvent(new KeyboardEvent("keyup", keyboardEventInit));

    // If Enter key is pressed and element is inside a form, submit the form
    if (step.key === "Enter") {
      const form = element.closest("form");
      if (form) {
        this.logger.info("Submitting form", { form });
        await this.sleep(100);
        form.submit();
      }
    }
  }

  private highlightElement(element: HTMLElement): void {
    this.removeHighlight();

    if (!this.overlay) {
      this.overlay = document.createElement("div");
      this.overlay.style.cssText = `
        position: absolute;
        pointer-events: none;
        border: 2px solid #3b82f6;
        background: rgba(59, 130, 246, 0.1);
        z-index: 2147483647;
        box-sizing: border-box;
      `;
      document.body.appendChild(this.overlay);
    }

    const rect = element.getBoundingClientRect();
    this.overlay.style.top = `${rect.top + window.scrollY}px`;
    this.overlay.style.left = `${rect.left + window.scrollX}px`;
    this.overlay.style.width = `${rect.width}px`;
    this.overlay.style.height = `${rect.height}px`;
    this.overlay.style.display = "block";

    setTimeout(() => {
      this.removeHighlight();
    }, 250);
  }

  private removeHighlight(): void {
    if (this.overlay) {
      this.overlay.style.display = "none";
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
