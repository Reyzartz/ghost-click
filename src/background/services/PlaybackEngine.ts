import { Macro } from "@/models";
import { ClickStep } from "@/models/MacroStep";
import { Emitter } from "@/utils/Emitter";
import { Logger } from "@/utils/Logger";

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
      initialUrl: macro.initialUrl,
      steps: macro.steps.length,
    });

    try {
      // Navigate to initial URL before playback
      await this.navigateToUrl(macro.initialUrl);

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

  private async navigateToUrl(url: string): Promise<void> {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.update(tabs[0].id, { url }, () => {
            this.logger.info("Navigated to initial URL", { url });
            // Wait for page to load
            setTimeout(() => resolve(), 2000);
          });
        } else {
          resolve();
        }
      });
    });
  }

  private async executeClickStep(step: ClickStep): Promise<void> {
    this.logger.info("Sending EXECUTE_ACTION to content script", { step });

    // Send action to content script to execute
    this.emitter.emit("EXECUTE_ACTION", { step });

    // Wait a bit for the action to complete
    await PlaybackEngine.sleep(100);
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
