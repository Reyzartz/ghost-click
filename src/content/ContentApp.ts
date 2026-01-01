import { Emitter } from "@/utils/Emitter";
import { BaseApp } from "@/utils/BaseApp";
import { Logger } from "@/utils/Logger";
import { BaseService } from "@/utils/BaseService";
import { UserInputService } from "./services/UserInputService";
import { ActionExecutorService } from "./services/ActionExecutorService";
import { StatusIndicatorViewModel } from "./viewmodels/StatusIndicatorViewModel";

export class ContentApp extends BaseApp {
  readonly statusIndicatorViewModel: StatusIndicatorViewModel;

  constructor() {
    const emitter = new Emitter("content");
    const logger = new Logger("ContentApp");
    const statusIndicatorViewModel = new StatusIndicatorViewModel(emitter);
    const viewModels = [statusIndicatorViewModel];

    const services: Array<BaseService> = [
      new UserInputService(emitter),
      new ActionExecutorService(emitter),
    ];

    super(emitter, logger, services, viewModels);

    this.statusIndicatorViewModel = statusIndicatorViewModel;
  }

  init(): void {
    this.logger.info("ContentApp initialized");

    super.init();
  }
}
