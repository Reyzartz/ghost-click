import { BaseService } from "@/utils/BaseService";
import { Emitter } from "./Emitter";
import { Logger } from "./Logger";

export class BaseApp {
  emitter: Emitter;
  logger: Logger;
  services: Array<BaseService> = [];

  constructor(emitter: Emitter, logger: Logger, services: Array<BaseService>) {
    this.emitter = emitter;
    this.logger = logger;
    this.services = services;
  }

  init(): void {
    this.services.forEach((service) => service.init());
  }
}
