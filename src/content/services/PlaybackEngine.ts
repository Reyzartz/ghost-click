import { Macro } from "@/models";
import { ClickStep } from "@/models/MacroStep";
import { Emitter } from "@/utils/Emitter";
import { Logger } from "@/utils/Logger";

// TODO:
// Move this to Background and communicate via messages
export class PlaybackEngine {
  private readonly logger: Logger;
  private isPlaying = false;

  constructor(private readonly emitter: Emitter) {
    this.logger = new Logger("PlaybackEngine");
  }

  async playMacro(macro: Macro): Promise<void> {
    if (this.isPlaying) {
      this.logger.warn("Playback already in progress");
      return;
    }

    this.isPlaying = true;
    this.logger.info("Starting playback", {
      macroId: macro.id,
      steps: macro.steps.length,
    });

    try {
      let prevTimestamp = 0;

      for (const step of macro.steps) {
        if (prevTimestamp > 0) {
          const delay = step.timestamp - prevTimestamp;
          if (delay > 0) {
            await PlaybackEngine.sleep(delay);
          }
        }

        this.logger.info(`Executing step ${step.type}`, { step });

        switch (step.type) {
          case "CLICK":
            await this.executeClickStep(step as ClickStep);
            break;
          default:
            this.logger.warn("Unknown step type", { type: step.type });
        }

        prevTimestamp = step.timestamp;
      }

      this.logger.info("Playback completed", { macroId: macro.id });

      this.emitter.emit("PLAYBACK_COMPLETED", { macroId: macro.id });
    } catch (err) {
      this.logger.error("Playback failed", { error: err, macroId: macro.id });

      this.emitter.emit("PLAYBACK_ERROR", { macroId: macro.id, error: err });
    } finally {
      this.isPlaying = false;
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

    await PlaybackEngine.highlightElement(element);

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

  private static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private static async highlightElement(element: Element): Promise<void> {
    if (!(element instanceof HTMLElement)) {
      return;
    }

    const originalOutline = element.style.outline;
    element.style.outline = "4px solid red";

    await PlaybackEngine.sleep(300);

    element.style.outline = originalOutline;
  }
}
