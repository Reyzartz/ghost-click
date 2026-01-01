import { Emitter } from "@/utils/Emitter";
import { BaseApp } from "@/utils/BaseApp";
import { Logger } from "@/utils/Logger";
import { BaseService } from "@/utils/BaseService";
import { UserInputService } from "./services/UserInputService";
import { ActionExecutorService } from "./services/ActionExecutorService";
import { StatusIndicatorViewModel } from "./viewmodels/StatusIndicatorViewModel";
import { NotificationViewModel } from "./viewmodels/NotificationViewModel";
import { RecordingStateRepository } from "@/repositories/RecordingStateRepository";
import { Storage } from "@/utils/Storage";

export class ContentApp extends BaseApp {
  readonly statusIndicatorViewModel: StatusIndicatorViewModel;
  readonly notificationViewModel: NotificationViewModel;

  constructor() {
    const emitter = new Emitter("content");
    const logger = new Logger("ContentApp");

    const storage = new Storage(chrome.storage.local);
    const recordingStateRepository = new RecordingStateRepository(storage);

    const statusIndicatorViewModel = new StatusIndicatorViewModel(
      emitter,
      recordingStateRepository
    );
    const notificationViewModel = new NotificationViewModel(emitter);
    const viewModels = [statusIndicatorViewModel, notificationViewModel];

    const services: Array<BaseService> = [
      new UserInputService(emitter, recordingStateRepository),
      new ActionExecutorService(emitter),
    ];

    super(emitter, logger, services, viewModels);

    this.statusIndicatorViewModel = statusIndicatorViewModel;
    this.notificationViewModel = notificationViewModel;
  }

  async init(): Promise<void> {
    this.logger.info("ContentApp initialized");

    await super.init();
  }
}
