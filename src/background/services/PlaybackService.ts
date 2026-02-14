import { BaseService } from "@/utils/BaseService";
import { Emitter } from "@/utils/Emitter";
import { Storage } from "@/utils/Storage";
import { MacroRepository } from "@/repositories/MacroRepository";
import { PlaybackStateRepository } from "@/repositories/PlaybackStateRepository";
import { SettingsRepository } from "@/repositories/SettingsRepository";
import { PlaybackEngine } from "./PlaybackEngine";
import { Macro } from "@/models";

export class PlaybackService extends BaseService {
  private readonly playbackEngine: PlaybackEngine;
  private readonly macroRepository: MacroRepository;
  private readonly playbackStateRepository: PlaybackStateRepository;
  private readonly settingsRepository: SettingsRepository;

  constructor(protected readonly emitter: Emitter) {
    super("PlaybackService", emitter);
    const storage = new Storage(chrome.storage.local);
    this.playbackStateRepository = new PlaybackStateRepository(storage);
    this.settingsRepository = new SettingsRepository(storage);
    this.playbackEngine = new PlaybackEngine(
      emitter,
      this.playbackStateRepository
    );
    this.macroRepository = new MacroRepository(emitter, storage);
  }

  init(): Promise<void> {
    this.logger.info("PlaybackService initialized");

    this.emitter.on("PLAY_MACRO", (data) => {
      void this.handlePlayMacro(data.macroId);
    });

    this.emitter.on("PLAY_MACRO_PREVIEW", (data) => {
      void this.handlePlayMacroPreview(data.macro);
    });

    this.emitter.on("STOP_PLAYBACK", () => {
      this.logger.info("Stop playback event received");
      this.playbackEngine.stop();
    });

    this.emitter.on("PAUSE_PLAYBACK", () => {
      this.logger.info("Pause playback event received");
      this.playbackEngine.pause();
    });

    this.emitter.on("RESUME_PLAYBACK", () => {
      this.logger.info("Resume playback event received");
      this.playbackEngine.resume();
    });

    this.emitter.on("PLAYBACK_ERROR", () => {
      void this.handlePlaybackError();
    });

    return Promise.resolve();
  }

  private async handlePlayMacro(macroId: string): Promise<void> {
    try {
      const macro = await this.macroRepository.findById(macroId);

      if (!macro) {
        this.logger.error("Macro not found", { macroId });
        return;
      }

      // Update lastPlayedAt timestamp
      const updatedMacro = {
        ...macro,
        lastPlayedAt: Date.now(),
      };
      await this.macroRepository.save(updatedMacro);

      await this.playbackEngine.playMacro(macro);
    } catch (err) {
      this.logger.error("Playback error", { error: err, macroId });
    }
  }

  private async handlePlayMacroPreview(macro: Macro): Promise<void> {
    try {
      this.logger.info("Playing macro preview", {
        macroId: macro.id,
        name: macro.name,
      });
      await this.playbackEngine.playMacro(macro);
    } catch (err) {
      this.logger.error("Macro preview playback error", {
        error: err,
        macroId: macro.id,
      });
    }
  }

  private async handlePlaybackError(): Promise<void> {
    const settings = await this.settingsRepository.get();

    if (settings.stopOnError) {
      this.logger.info("Stopping playback due to error (stopOnError enabled)");
      this.emitter.emit("STOP_PLAYBACK");
    } else {
      this.logger.info(
        "Continuing playback despite error (stopOnError disabled)"
      );
    }
  }
}
