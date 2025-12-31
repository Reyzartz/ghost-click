import { BaseService } from "@/utils/BaseService";
import { Emitter } from "@/utils/Emitter";
import { Logger } from "@/utils/Logger";
import { ShortcutService } from "./services/ShortcutService";
import { RecorderService } from "./services/RecorderService";
import { BaseApp } from "@/utils/BaseApp";

export class BackgroundApp extends BaseApp {
  constructor() {
    const emitter = new Emitter("background");
    const logger = new Logger("BackgroundApp");
    const services: Array<BaseService> = [
      new ShortcutService(emitter),
      new RecorderService(emitter),
    ];

    super(emitter, logger, services);
  }

  init(): void {
    this.logger.info("BackgroundApp initialized");

    super.init();
  }
}
