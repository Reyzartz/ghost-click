import { BaseService } from "../../utils/BaseService";
import { Emitter } from "@/utils/Emitter";
import { MacroUtils } from "@/utils/MacroUtils";
import { SidepanelStateService } from "@/utils/SidepanelStateService";
import { TabsManager } from "@/utils/TabsManager";

export class ShortcutService extends BaseService {
  private static commands = {
    START_RECORDING: "start-recording",
    STOP_RECORDING: "stop-recording",
    OPEN_SIDE_PANEL: "open-side-panel",
    TOGGLE_QUICK_ACTIONS: "toggle-quick-actions",
  };

  constructor(
    protected readonly emitter: Emitter,
    private readonly sidepanelStateService: SidepanelStateService
  ) {
    super("ShortcutService", emitter);
  }

  init(): Promise<void> {
    this.logger.info("ShortcutService initialized");

    chrome.commands.onCommand.addListener((command) => {
      this.onCommandListener(command);
    });

    return Promise.resolve();
  }

  onCommandListener(command: string): void {
    switch (command) {
      case ShortcutService.commands.START_RECORDING:
        void this.startRecording();
        break;

      case ShortcutService.commands.STOP_RECORDING:
        this.emitter.emit("STOP_RECORDING", {}, { currentTab: false });
        break;
      case ShortcutService.commands.OPEN_SIDE_PANEL:
        void this.sidepanelStateService.toggleSidePanel();
        break;
      case ShortcutService.commands.TOGGLE_QUICK_ACTIONS:
        this.emitter.emit("TOGGLE_QUICK_ACTIONS");
        break;
      default:
        this.logger.warn(`Unhandled command: ${command}`);
    }
  }

  private async startRecording(): Promise<void> {
    const sessionId = MacroUtils.generateSessionId();

    const activeTab = await TabsManager.getActiveTab();

    if (activeTab === null) {
      this.logger.error("Cannot start recording: no active tab");
      return;
    }

    const initialUrl = activeTab.url;
    const tabId = activeTab.id;

    if (initialUrl === undefined || tabId === undefined) {
      this.logger.error("Cannot start recording: no active tab URL or ID");
      return;
    }

    this.emitter.emit("START_RECORDING", {
      sessionId,
      initialUrl,
      tabId,
    });
  }
}
