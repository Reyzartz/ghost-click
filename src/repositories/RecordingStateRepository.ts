import { RecordingState } from "@/models/RecordingState";
import { Storage } from "@/utils/Storage";
import { Logger } from "@/utils/Logger";

const RECORDING_STATE_KEY = "recordingState";

export class RecordingStateRepository {
  private readonly logger: Logger;

  constructor(private readonly storage: Storage) {
    this.logger = new Logger("RecordingStateRepository");
  }

  async get(): Promise<RecordingState | null> {
    const state = await this.storage.get<RecordingState>(RECORDING_STATE_KEY);
    if (state) {
      this.logger.info("Loaded recording state", { state });
    }
    return state;
  }

  async save(state: RecordingState): Promise<void> {
    await this.storage.set(RECORDING_STATE_KEY, state);
    this.logger.info("Saved recording state", { state });
  }

  async update(partial: Partial<RecordingState>): Promise<void> {
    const current = await this.get();
    const updated: RecordingState = {
      isRecording: current?.isRecording ?? false,
      sessionId: current?.sessionId ?? null,
      tabId: current?.tabId ?? null,
      macro: current?.macro ?? null,
      ...partial,
    };
    await this.save(updated);
  }

  async clear(): Promise<void> {
    await this.storage.remove(RECORDING_STATE_KEY);
    this.logger.info("Cleared recording state");
  }

  async isRecording(): Promise<boolean> {
    const state = await this.get();
    return state?.isRecording ?? false;
  }

  async getSessionId(): Promise<string | null> {
    const state = await this.get();
    return state?.sessionId ?? null;
  }
}
