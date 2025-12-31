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

  init(): void {
    this.services.forEach((service) => service.init());
    this.viewModels.forEach((vm) => vm.init());
  }
}
