import { BaseService } from "@/services/BaseService";
import { Emitter } from "./Emitter";
import { Logger } from "./Logger";
import { ShortcutService } from "@/services/ShortcutService";

export class App {
  emitter: Emitter;
  logger: Logger;
  services: Array<BaseService> = [];

  constructor(emitter: Emitter, logger: Logger, services: Array<BaseService>) {
    this.emitter = emitter;
    this.logger = logger;
    this.services = services;
  }

  init(): void {
    this.logger.info("App initialized");

    this.services.forEach((service) => service.init());
  }

  static create(): App {
    const emitter = new Emitter();
    const logger = new Logger("App");
    const services: Array<BaseService> = [new ShortcutService(emitter)];

    return new App(emitter, logger, services);
  }
}
