import { BaseService } from "@/utils/BaseService";
import { Emitter } from "@/utils/Emitter";
import { MacroRepository } from "@/repositories/MacroRepository";
import { PlaybackEngine } from "./PlaybackEngine";

export class PlaybackService extends BaseService {
  private readonly playbackEngine: PlaybackEngine;

  constructor(
    protected readonly emitter: Emitter,
    private readonly macroRepository: MacroRepository
  ) {
    super("PlaybackService", emitter);
    this.playbackEngine = new PlaybackEngine(emitter);
  }

  init(): void {
    this.logger.info("PlaybackService initialized");

    this.emitter.on("PLAY_MACRO", async (data) => {
      await this.handlePlayMacro(data.macroId);
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
