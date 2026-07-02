import { Macro } from "@/models";
import {
  ClickStep,
  InputStep,
  KeyPressStep,
  MacroStep,
  NavigateStep,
  PauseStep,
} from "@/models/MacroStep";
import { Emitter } from "@/utils/Emitter";
import { Logger } from "@/utils/Logger";
import { PlaybackStateRepository } from "@/repositories/PlaybackStateRepository";
import { SettingsRepository } from "@/repositories/SettingsRepository";
import { TabsManager } from "@/utils/TabsManager";

export class PlaybackEngine {
  private readonly logger: Logger;
  private isPlaying = false;
  private shouldStop = false;
  private isPaused = false;

  constructor(
    private readonly emitter: Emitter,
    private readonly playbackStateRepository: PlaybackStateRepository,
    private readonly settingsRepository: SettingsRepository
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

        this.logger.info(`Executing step ${step.type}`, { step });

        try {
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
              await this.executeNavigateStep(step);
              break;
            case "PAUSE":
              await this.executePauseStep(step);
              break;
            default:
              this.logger.warn("Unknown step type");
          }
        } catch (err) {
          this.emitter.emit("PLAYBACK_STEP_ERROR", {
            step,
            error: (err as Error)?.message,
          });
        }

        // Wait here if this step just paused playback, even if it's the last
        // step — otherwise the loop would end and playback would be reported
        // as completed instead of staying paused.
        while (this.isPaused && !this.shouldStop) {
          await PlaybackEngine.sleep(100);
        }

        if (this.shouldStop) {
          this.logger.info("Playback stopped by user");
          break;
        }

        // Wait for the delay before next step
        if (step.delay > 0) {
          await PlaybackEngine.sleep(step.delay);
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

      this.emitter.emit("STOP_PLAYBACK", undefined, {
        currentTab: false,
      });
    } finally {
      this.isPlaying = false;
      await this.playbackStateRepository.clear();
    }
  }

  private async navigateToUrl(url: string): Promise<void> {
    const tab = await TabsManager.getActiveTab();

    if (!tab?.id) {
      this.logger.error("Cannot navigate to URL: no active tab");
      return;
    }

    await TabsManager.navigate(tab.id, url);

    await TabsManager.waitForTabLoad(tab.id);

    return;
  }

  private async executeClickStep(step: ClickStep): Promise<void> {
    this.logger.info("Sending EXECUTE_ACTION to content script", { step });

    // Update current step id
    await this.playbackStateRepository.update({ currentStepId: step.id });

    const clicksCount = step.clicksCount;
    for (let i = 0; i < clicksCount; i++) {
      // Send action to content script to execute
      this.emitter.emit("EXECUTE_ACTION", { step });

      // Wait a bit for the action to complete
      await PlaybackEngine.sleep(100);

      // Add small delay between clicks if there are multiple
      if (i < clicksCount - 1) {
        await PlaybackEngine.sleep(50);
      }
    }
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

  private async executeNavigateStep(step: NavigateStep): Promise<void> {
    this.logger.info("Navigating to URL", { step });

    // Update current step id
    await this.playbackStateRepository.update({ currentStepId: step.id });

    // Navigate to the specified URL
    await this.navigateToUrl(step.url);

    // Send action to content script to execute (for consistency)
    this.emitter.emit("EXECUTE_ACTION", { step });

    // Wait a bit for the navigation to complete
    await PlaybackEngine.sleep(100);
  }

  private async executePauseStep(step: PauseStep): Promise<void> {
    this.logger.info("Executing PAUSE step", { step });

    await this.playbackStateRepository.update({
      currentStepId: step.id,
      isPaused: true,
    });
    this.isPaused = true;

    // Tell the sidepanel which step is current (same pattern as all other steps)
    this.emitter.emit("EXECUTE_ACTION", { step });

    // Notify sidepanel that playback is paused
    this.emitter.emit("PAUSE_PLAYBACK", undefined, { currentTab: false });

    // Show pause banner in the page's content script
    this.emitter.emit("PAUSE_STEP", { message: step.message });
  }

  async handleStepFailure(step: MacroStep, err: unknown): Promise<void> {
    const message = err instanceof Error ? err.message : "Unknown error";

    const settings = await this.settingsRepository.get();

    switch (settings.onStepFailure) {
      case "pause":
        this.logger.info("Pausing playback due to step failure", {
          stepId: step.id,
        });
        this.isPaused = true;
        await this.playbackStateRepository.update({
          currentStepId: step.id,
          isPaused: true,
        });
        this.emitter.emit("PAUSE_PLAYBACK", undefined, { currentTab: false });
        this.emitter.emit("PAUSE_STEP", {
          message: `Step \`${step.name}\` \nfailed: ${message}.\nFix the issue, then resume.`,
        });
        break;
      case "continue":
        this.logger.info("Continuing playback despite step failure", {
          stepId: step.id,
        });
        break;
      case "stop":
      default:
        // Treat a missing/unrecognized value (e.g. settings saved before
        // this field existed) the same as "stop" — the safe default.
        this.logger.info("Stopping playback due to step failure", {
          stepId: step.id,
        });
        this.shouldStop = true;
        this.emitter.emit("STOP_PLAYBACK", undefined, { currentTab: false });
        break;
    }
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
