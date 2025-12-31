import { Emitter } from "@/utils/Emitter";
import { BaseApp } from "@/utils/BaseApp";
import { Logger } from "@/utils/Logger";
import { BaseService } from "@/utils/BaseService";

export class ContentApp extends BaseApp {
  constructor() {
    const emitter = new Emitter("content");
    const logger = new Logger("ContentApp");
    const services: Array<BaseService> = [];

    super(emitter, logger, services);
  }

  init(): void {
    this.logger.info("ContentApp initialized");

    super.init();
  }
}
