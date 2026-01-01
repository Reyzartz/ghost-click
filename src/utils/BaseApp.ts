import { BaseService } from "@/utils/BaseService";
import { Emitter } from "./Emitter";
import { Logger } from "./Logger";
import { BaseViewModel } from "./BaseViewModel";

export class BaseApp {
  emitter: Emitter;
  logger: Logger;
  services: Array<BaseService> = [];
  viewModels: Array<BaseViewModel> = [];

  constructor(
    emitter: Emitter,
    logger: Logger,
    services: Array<BaseService>,
    viewModels: Array<BaseViewModel> = []
  ) {
    this.emitter = emitter;
    this.logger = logger;
    this.services = services;
    this.viewModels = viewModels;
  }

  async init(): Promise<void> {
    for (const service of this.services) {
      await service.init();
    }
    for (const vm of this.viewModels) {
      await vm.init();
    }
  }
}
