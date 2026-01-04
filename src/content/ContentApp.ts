import { Emitter } from "@/utils/Emitter";
import { BaseApp } from "@/utils/BaseApp";
import { Logger } from "@/utils/Logger";
import { BaseService } from "@/utils/BaseService";
import { UserInputService } from "./services/UserInputService";
import { ActionExecutorService } from "./services/ActionExecutorService";
import { StatusIndicatorViewModel } from "./viewmodels/StatusIndicatorViewModel";
import { NotificationViewModel } from "./viewmodels/NotificationViewModel";
import { QuickActionsViewModel } from "./viewmodels/QuickActionsViewModel";
import { RecordingStateRepository } from "@/repositories/RecordingStateRepository";
import { PlaybackStateRepository } from "@/repositories/PlaybackStateRepository";
import { MacroRepository } from "@/repositories/MacroRepository";
import { Storage } from "@/utils/Storage";

export class ContentApp extends BaseApp {
  readonly statusIndicatorViewModel: StatusIndicatorViewModel;
  readonly notificationViewModel: NotificationViewModel;
  readonly quickActionsViewModel: QuickActionsViewModel;

  constructor() {
    const emitter = new Emitter("content");
    const logger = new Logger("ContentApp");

    const storage = new Storage(chrome.storage.local);
    const recordingStateRepository = new RecordingStateRepository(storage);
    const playbackStateRepository = new PlaybackStateRepository(storage);
    const macroRepository = new MacroRepository(emitter, storage);

    const statusIndicatorViewModel = new StatusIndicatorViewModel(
      emitter,
      recordingStateRepository,
      playbackStateRepository
    );
    const notificationViewModel = new NotificationViewModel(emitter);
    const quickActionsViewModel = new QuickActionsViewModel(
      macroRepository,
      emitter
    );
    const viewModels = [
      statusIndicatorViewModel,
      notificationViewModel,
      quickActionsViewModel,
    ];

    const services: Array<BaseService> = [
      new UserInputService(emitter, recordingStateRepository),
      new ActionExecutorService(emitter, playbackStateRepository),
    ];

    super(emitter, logger, services, viewModels);

    this.statusIndicatorViewModel = statusIndicatorViewModel;
    this.notificationViewModel = notificationViewModel;
    this.quickActionsViewModel = quickActionsViewModel;
  }

  async init(): Promise<void> {
    this.logger.info("ContentApp initialized");

    await super.init();
  }
}
