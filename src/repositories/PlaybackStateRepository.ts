import { PlaybackState } from "@/models/PlaybackState";
import { Storage } from "@/utils/Storage";
import { Logger } from "@/utils/Logger";

const PLAYBACK_STATE_KEY = "playbackState";

export class PlaybackStateRepository {
  private readonly logger: Logger;

  constructor(private readonly storage: Storage) {
    this.logger = new Logger("PlaybackStateRepository");
  }

  async get(): Promise<PlaybackState | null> {
    const state = await this.storage.get<PlaybackState>(PLAYBACK_STATE_KEY);
    if (state) {
      this.logger.info("Loaded playback state", { state });
    }
    return state;
  }

  async save(state: PlaybackState): Promise<void> {
    await this.storage.set(PLAYBACK_STATE_KEY, state);
    this.logger.info("Saved playback state", { state });
  }

  async update(partial: Partial<PlaybackState>): Promise<void> {
    const current = await this.get();
    const updated: PlaybackState = {
      isPlaying: current?.isPlaying ?? false,
      macroId: current?.macroId ?? null,
      ...partial,
    };
    await this.save(updated);
  }

  async clear(): Promise<void> {
    await this.storage.remove(PLAYBACK_STATE_KEY);
    this.logger.info("Cleared playback state");
  }

  async isPlaying(): Promise<boolean> {
    const state = await this.get();
    return state?.isPlaying ?? false;
  }

  async getMacroId(): Promise<string | null> {
    const state = await this.get();
    return state?.macroId ?? null;
  }
}
