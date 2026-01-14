import { BaseService } from "@/utils/BaseService";
import { Emitter } from "@/utils/Emitter";
import { ClickStep, InputStep, KeyPressStep } from "@/models/MacroStep";
import { PlaybackStateRepository } from "@/repositories/PlaybackStateRepository";

export class ActionExecutorService extends BaseService {
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
  }

  private async handleExecuteAction(step: any): Promise<void> {
    try {
      this.logger.info(`Executing action: ${step.type}`, { step });

      switch (step.type) {
        case "CLICK":
          await this.executeClickStep(step as ClickStep);
          break;
        case "INPUT":
          await this.executeInputStep(step as InputStep);
          break;
        case "KEYPRESS":
          await this.executeKeyPressStep(step as KeyPressStep);
          break;
        default:
          this.logger.warn("Unknown action type", { type: step.type });
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

      this.emitter.emit("PLAYBACK_ERROR", {
        macroId,
        stepId: step.id,
        error: (err as Error).message,
      });
    }
  }

  private async executeClickStep(step: ClickStep): Promise<void> {
    const element = this.findElement(step.target);

    if (!element) {
      throw new Error(
        `Element not found for target: ${JSON.stringify(step.target)}`
      );
    }

    if (!(element instanceof HTMLElement)) {
      throw new Error("Found target is not an HTMLElement");
    }

    this.logger.info("Clicking element", { selector: step.target });

    // Only scroll if element is not in view
    const isInView = await this.isElementInView(element);
    if (!isInView) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      await this.sleep(300);
    }

    await this.highlightElement(element);

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

  private static readonly findElementFromXPath = (
    xpath: string
  ): Element | null => {
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    );
    return result.singleNodeValue as Element | null;
  };

  private static readonly findElementFromId = (id: string): Element | null => {
    return document.getElementById(id);
  };

  private static readonly findElementFromClassName = (
    className: string
  ): Element | null => {
    return document.querySelector(`.${className}`);
  };

  private findElement(target: ClickStep["target"]): Element | null {
    switch (target.defaultSelector) {
      case "xpath":
        return ActionExecutorService.findElementFromXPath(target.xpath);
      case "id":
        return ActionExecutorService.findElementFromId(target.id);
      case "className":
        return ActionExecutorService.findElementFromClassName(target.className);
      default:
        this.logger.warn("Unknown selector type", {
          defaultSelector: target.defaultSelector,
        });
        return null;
    }
  }

  private async executeInputStep(step: InputStep): Promise<void> {
    const element = this.findElement(step.target);

    if (!element) {
      throw new Error(
        `Element not found for target: ${JSON.stringify(step.target)}`
      );
    }

    if (
      !(
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement
      )
    ) {
      throw new Error("Found target is not an input or textarea element");
    }

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

    await this.highlightElement(element);

    // Focus the element
    element.focus();

    // Set the value
    element.value = step.value;

    // Trigger input event to notify frameworks (React, Vue, etc.)
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }

  private async executeKeyPressStep(step: KeyPressStep): Promise<void> {
    const element = this.findElement(step.target);

    if (!element) {
      throw new Error(
        `Element not found for target: ${JSON.stringify(step.target)}`
      );
    }

    if (!(element instanceof HTMLElement)) {
      throw new Error("Found target is not an HTMLElement");
    }

    this.logger.info("Pressing key", { selector: step.target, key: step.key });

    // Only scroll if element is not in view
    const isInView = await this.isElementInView(element);
    if (!isInView) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      await this.sleep(300);
    }

    await this.highlightElement(element);

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

  private async highlightElement(element: HTMLElement): Promise<void> {
    const originalOutline = element.style.outline;
    element.style.outline = "4px solid red";

    setTimeout(function () {
      element.style.outline = originalOutline;
    }, 250);

    await this.sleep(300);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
