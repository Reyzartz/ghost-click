import { Macro } from "@/models";
import { ClickStep, InputStep, KeyPressStep } from "@/models/MacroStep";
import { Emitter } from "@/utils/Emitter";
import { Logger } from "@/utils/Logger";
import { PlaybackStateRepository } from "@/repositories/PlaybackStateRepository";

export class PlaybackEngine {
  private readonly logger: Logger;
  private isPlaying = false;
  private shouldStop = false;
  private isPaused = false;

  constructor(
    private readonly emitter: Emitter,
    private readonly playbackStateRepository: PlaybackStateRepository
  ) {
    this.logger = new Logger("PlaybackEngine");
  }

  stop(): void {
    this.logger.info("Stop playback requested");
    this.shouldStop = true;
    this.isPaused = false;
  }

  pause(): void {
    this.logger.info("Pause playback requested");
    this.isPaused = true;
    void this.playbackStateRepository.update({ isPaused: true });
  }

  resume(): void {
    this.logger.info("Resume playback requested");
    this.isPaused = false;
    void this.playbackStateRepository.update({ isPaused: false });
  }

  async playMacro(macro: Macro): Promise<void> {
    if (this.isPlaying) {
      this.logger.warn("Playback already in progress");
      return;
    }

    this.isPlaying = true;
    this.shouldStop = false;
    this.isPaused = false;
    this.logger.info("Starting playback", {
      macroId: macro.id,
      initialUrl: macro.initialUrl,
      steps: macro.steps.length,
    });

    // Save playback state
    await this.playbackStateRepository.save({
      isPlaying: true,
      isPaused: false,
      macroId: macro.id,
      currentStepId: null,
    });

    try {
      // Navigate to initial URL before playback
      await this.navigateToUrl(macro.initialUrl);

      let prevTimestamp = 0;

      for (const step of macro.steps) {
        // Check if stop was requested
        if (this.shouldStop) {
          this.logger.info("Playback stopped by user");
          break;
        }

        // Wait while paused
        while (this.isPaused && !this.shouldStop) {
          await PlaybackEngine.sleep(100);
        }

        // Check again if stop was requested during pause
        if (this.shouldStop) {
          this.logger.info("Playback stopped by user");
          break;
        }

        if (prevTimestamp > 0) {
          const delay = step.timestamp - prevTimestamp;
          if (delay > 0) {
            await PlaybackEngine.sleep(delay);
          }
        }

        this.logger.info(`Executing step ${step.type}`, { step });

        try {
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
              this.logger.warn("Unknown step type");
          }
        } catch (err) {
          this.logger.error("Step execution failed, continuing", {
            error: err,
            stepId: step.id,
            stepType: step.type,
          });

          this.emitter.emit("PLAYBACK_ERROR", {
            macroId: macro.id,
            stepId: step.id,
            error: (err as Error)?.message,
          });
        } finally {
          prevTimestamp = step.timestamp;
        }
      }

      if (this.shouldStop) {
        this.logger.info("Playback stopped", { macroId: macro.id });
      } else {
        this.logger.info("Playback completed", { macroId: macro.id });
        this.emitter.emit(
          "PLAYBACK_COMPLETED",
          { macroId: macro.id },
          {
            currentTab: false,
          }
        );
      }
    } catch (err) {
      this.logger.error("Playback failed", { error: err, macroId: macro.id });

      this.emitter.emit("PLAYBACK_ERROR", {
        macroId: macro.id,
        stepId: null,
        error: err,
      });

      this.emitter.emit("STOP_PLAYBACK", undefined, {
        currentTab: false,
      });
    } finally {
      this.isPlaying = false;
      await this.playbackStateRepository.clear();
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

    // Update current step id
    await this.playbackStateRepository.update({ currentStepId: step.id });

    // Send action to content script to execute
    this.emitter.emit("EXECUTE_ACTION", { step });

    // Wait a bit for the action to complete
    await PlaybackEngine.sleep(100);
  }

  private async executeInputStep(step: InputStep): Promise<void> {
    this.logger.info("Sending EXECUTE_ACTION to content script", { step });

    // Update current step id
    await this.playbackStateRepository.update({ currentStepId: step.id });

    // Send action to content script to execute
    this.emitter.emit("EXECUTE_ACTION", { step });

    // Wait a bit for the action to complete
    await PlaybackEngine.sleep(100);
  }

  private async executeKeyPressStep(step: KeyPressStep): Promise<void> {
    this.logger.info("Sending EXECUTE_ACTION to content script", { step });

    // Update current step id
    await this.playbackStateRepository.update({ currentStepId: step.id });

    // Send action to content script to execute
    this.emitter.emit("EXECUTE_ACTION", { step });

    // Wait a bit for the action to complete
    await PlaybackEngine.sleep(100);
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
