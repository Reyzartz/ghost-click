import { BaseService } from "@/utils/BaseService";
import { Emitter } from "@/utils/Emitter";
import { Storage } from "@/utils/Storage";
import { MacroRepository } from "@/repositories/MacroRepository";
import { PlaybackStateRepository } from "@/repositories/PlaybackStateRepository";
import { PlaybackEngine } from "./PlaybackEngine";

export class PlaybackService extends BaseService {
  private readonly playbackEngine: PlaybackEngine;
  private readonly macroRepository: MacroRepository;
  private readonly playbackStateRepository: PlaybackStateRepository;

  constructor(protected readonly emitter: Emitter) {
    super("PlaybackService", emitter);
    const storage = new Storage(chrome.storage.local);
    this.playbackStateRepository = new PlaybackStateRepository(storage);
    this.playbackEngine = new PlaybackEngine(
      emitter,
      this.playbackStateRepository
    );
    this.macroRepository = new MacroRepository(emitter, storage);
  }

  async init(): Promise<void> {
    this.logger.info("PlaybackService initialized");

    this.emitter.on("PLAY_MACRO", async (data) => {
      await this.handlePlayMacro(data.macroId);
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
  }

  private async handlePlayMacro(macroId: string): Promise<void> {
    try {
      const macro = await this.macroRepository.findById(macroId);

      if (!macro) {
        this.logger.error("Macro not found", { macroId });
        return;
      }

      await this.playbackEngine.playMacro(macro);
    } catch (err) {
      this.logger.error("Playback error", { error: err, macroId });
    }
  }
}
