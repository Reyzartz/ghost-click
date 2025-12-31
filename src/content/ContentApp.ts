import { Emitter } from "@/utils/Emitter";
import { BaseApp } from "@/utils/BaseApp";
import { Logger } from "@/utils/Logger";
import { BaseService } from "@/utils/BaseService";
import { UserInputService } from "./services/UserInputService";
import { PlaybackService } from "./services/PlaybackService";
import { Storage } from "@/utils/Storage";
import { MacroRepository } from "@/repositories/MacroRepository";
import { StatusIndicatorViewModel } from "./viewmodels/StatusIndicatorViewModel";

export class ContentApp extends BaseApp {
  readonly statusIndicatorViewModel: StatusIndicatorViewModel;

  constructor() {
    const emitter = new Emitter("content");
    const logger = new Logger("ContentApp");
    const storage = new Storage(chrome.storage.local);
    const statusIndicatorViewModel = new StatusIndicatorViewModel(emitter);
    const viewModels = [statusIndicatorViewModel];

    const macroRepository = new MacroRepository(emitter, storage);

    const services: Array<BaseService> = [
      new UserInputService(emitter),
      new PlaybackService(emitter, macroRepository),
    ];

    super(emitter, logger, services, viewModels);

    this.statusIndicatorViewModel = statusIndicatorViewModel;
  }

  init(): void {
    this.logger.info("ContentApp initialized");

    super.init();
  }
}
