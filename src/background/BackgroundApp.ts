import { BaseService } from "@/utils/BaseService";
import { Emitter } from "@/utils/Emitter";
import { Logger } from "@/utils/Logger";
import { ShortcutService } from "./services/ShortcutService";
import { RecorderService } from "./services/RecorderService";
import { BaseApp } from "@/utils/BaseApp";
import { MacroRepository } from "@/repositories/MacroRepository";
import { Storage } from "@/utils/Storage";

export class BackgroundApp extends BaseApp {
  constructor() {
    const emitter = new Emitter("background");
    const logger = new Logger("BackgroundApp");
    const storage = new Storage(chrome.storage.local);

    const macroRepository = new MacroRepository(emitter, storage);

    const services: Array<BaseService> = [
      new ShortcutService(emitter),
      new RecorderService(emitter, macroRepository),
    ];

    super(emitter, logger, services);
  }

  init(): void {
    this.logger.info("BackgroundApp initialized");

    super.init();
  }
}
