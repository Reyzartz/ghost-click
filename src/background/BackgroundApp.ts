import { BaseService } from "@/utils/BaseService";
import { Emitter } from "@/utils/Emitter";
import { Logger } from "@/utils/Logger";
import { ShortcutService } from "./services/ShortcutService";
import { RecorderService } from "./services/RecorderService";
import { PlaybackService } from "./services/PlaybackService";
import { BaseApp } from "@/utils/BaseApp";
import { MacroRepository } from "@/repositories/MacroRepository";
import { RecordingStateRepository } from "@/repositories/RecordingStateRepository";
import { SettingsRepository } from "@/repositories/SettingsRepository";
import { Storage } from "@/utils/Storage";
import { SidepanelStateService } from "@/utils/SidepanelStateService";

export class BackgroundApp extends BaseApp {
  constructor() {
    const emitter = new Emitter("background");
    const logger = new Logger("BackgroundApp");
    const storage = new Storage(chrome.storage.local);

    const macroRepository = new MacroRepository(emitter, storage);
    const recordingStateRepository = new RecordingStateRepository(storage);
    const settingsRepository = new SettingsRepository(storage);
    const sidepanelStateService = new SidepanelStateService(emitter);

    const services: Array<BaseService> = [
      sidepanelStateService,
      new ShortcutService(emitter, sidepanelStateService),
      new RecorderService(
        emitter,
        macroRepository,
        recordingStateRepository,
        settingsRepository
      ),
      new PlaybackService(emitter),
    ];

    super(emitter, logger, services);
  }

  async init(): Promise<void> {
    this.logger.info("BackgroundApp initialized");

    await super.init();
  }
}
