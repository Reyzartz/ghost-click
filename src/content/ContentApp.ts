import { Emitter } from "@/utils/Emitter";
import { BaseApp } from "@/utils/BaseApp";
import { Logger } from "@/utils/Logger";
import { BaseService } from "@/utils/BaseService";
import { UserInputService } from "./services/UserInputService";
import { ActionExecutorService } from "./services/ActionExecutorService";
import { StatusIndicatorViewModel } from "./viewmodels/StatusIndicatorViewModel";
import { NotificationViewModel } from "./viewmodels/NotificationViewModel";

export class ContentApp extends BaseApp {
  readonly statusIndicatorViewModel: StatusIndicatorViewModel;
  readonly notificationViewModel: NotificationViewModel;

  constructor() {
    const emitter = new Emitter("content");
    const logger = new Logger("ContentApp");
    const statusIndicatorViewModel = new StatusIndicatorViewModel(emitter);
    const notificationViewModel = new NotificationViewModel(emitter);
    const viewModels = [statusIndicatorViewModel, notificationViewModel];

    const services: Array<BaseService> = [
      new UserInputService(emitter),
      new ActionExecutorService(emitter),
    ];

    super(emitter, logger, services, viewModels);

    this.statusIndicatorViewModel = statusIndicatorViewModel;
    this.notificationViewModel = notificationViewModel;
  }

  init(): void {
    this.logger.info("ContentApp initialized");

    super.init();
  }
}
