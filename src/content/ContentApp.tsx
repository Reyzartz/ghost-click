import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Emitter } from "@/utils/Emitter";
import { BaseApp } from "@/utils/BaseApp";
import { Logger } from "@/utils/Logger";
import { BaseService } from "@/utils/BaseService";
import { UserInputService } from "./services/UserInputService";
import { ActionExecutorService } from "./services/ActionExecutorService";
import { ElementInspectorService } from "./services/ElementInspectorService";
import { StatusIndicatorViewModel } from "./viewmodels/StatusIndicatorViewModel";
import { NotificationViewModel } from "./viewmodels/NotificationViewModel";
import { RecordingStateRepository } from "@/repositories/RecordingStateRepository";
import { PlaybackStateRepository } from "@/repositories/PlaybackStateRepository";
import { SettingsRepository } from "@/repositories/SettingsRepository";
import { Storage } from "@/utils/Storage";
import { ThemeService } from "@/sidepanel/services/ThemeService";
import tailwindCss from "../styles/tailwind.css?inline";
import StatusApp from "./StatusApp";
import NotificationApp from "./NotificationApp";

export class ContentApp extends BaseApp {
  readonly statusIndicatorViewModel: StatusIndicatorViewModel;
  readonly notificationViewModel: NotificationViewModel;
  private themeService?: ThemeService;
  private readonly settingsRepository: SettingsRepository;
  private readonly emitterInstance: Emitter;
  private reactRoot: ReturnType<typeof createRoot> | null = null;

  constructor() {
    const emitter = new Emitter("content");
    const logger = new Logger("ContentApp");

    const storage = new Storage(chrome.storage.local);
    const recordingStateRepository = new RecordingStateRepository(storage);
    const playbackStateRepository = new PlaybackStateRepository(storage);
    const settingsRepository = new SettingsRepository(storage);

    const statusIndicatorViewModel = new StatusIndicatorViewModel(
      emitter,
      recordingStateRepository,
      playbackStateRepository
    );
    const notificationViewModel = new NotificationViewModel(emitter);
    const viewModels = [statusIndicatorViewModel, notificationViewModel];

    const services: Array<BaseService> = [
      new UserInputService(
        emitter,
        recordingStateRepository,
        settingsRepository
      ),
      new ActionExecutorService(emitter, playbackStateRepository),
      new ElementInspectorService(emitter, settingsRepository),
    ];

    super(emitter, logger, services, viewModels);

    this.emitterInstance = emitter;
    this.settingsRepository = settingsRepository;
    this.statusIndicatorViewModel = statusIndicatorViewModel;
    this.notificationViewModel = notificationViewModel;
  }

  mount(): void {
    if (this.reactRoot) return;

    const host = document.createElement("div");
    host.id = "ghost-click-shadow-host";
    document.body.appendChild(host);

    const shadowRoot = host.attachShadow({ mode: "open" });

    const styleEl = document.createElement("style");
    styleEl.textContent = tailwindCss;
    shadowRoot.appendChild(styleEl);

    const mountEl = document.createElement("div");
    mountEl.id = "ghost-click-mount";
    shadowRoot.appendChild(mountEl);

    this.themeService = new ThemeService(
      this.settingsRepository,
      this.emitterInstance,
      mountEl
    );
    void this.themeService.init();

    this.reactRoot = createRoot(mountEl);
    this.reactRoot.render(
      <StrictMode>
        <StatusApp app={this} />
        <NotificationApp app={this} />
      </StrictMode>
    );
  }

  unmount(): void {
    this.reactRoot?.unmount();
    this.reactRoot = null;
    document.getElementById("ghost-click-shadow-host")?.remove();
  }

  async init(): Promise<void> {
    this.logger.info("ContentApp initialized");

    this.mount();

    await super.init();
  }
}
