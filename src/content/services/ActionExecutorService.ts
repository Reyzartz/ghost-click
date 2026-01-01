import { BaseService } from "@/utils/BaseService";
import { Emitter } from "@/utils/Emitter";
import { ClickStep } from "@/models/MacroStep";

export class ActionExecutorService extends BaseService {
  constructor(protected readonly emitter: Emitter) {
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
        default:
          this.logger.warn("Unknown action type", { type: step.type });
      }
    } catch (err) {
      this.logger.error("Action execution failed", { error: err, step });
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

    await this.highlightElement(element);

    element.click();
  }

  private findElement(target: ClickStep["target"]): Element | null {
    if (target.xpath) {
      const result = document.evaluate(
        target.xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      );
      if (result.singleNodeValue) return result.singleNodeValue as Element;
    }

    if (target.id) {
      const byId = document.getElementById(target.id);
      if (byId) return byId;
    }

    if (target.className) {
      const byClass = document.querySelector(`.${target.className}`);
      if (byClass) return byClass;
    }

    return null;
  }

  private async highlightElement(element: HTMLElement): Promise<void> {
    const originalOutline = element.style.outline;
    element.style.outline = "4px solid red";

    await this.sleep(300);

    element.style.outline = originalOutline;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
