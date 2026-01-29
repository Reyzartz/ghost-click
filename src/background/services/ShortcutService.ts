import { BaseService } from "../../utils/BaseService";
import { Emitter } from "@/utils/Emitter";
import { MacroUtils } from "@/utils/MacroUtils";

export class ShortcutService extends BaseService {
  private static commands = {
    START_RECORDING: "start-recording",
    STOP_RECORDING: "stop-recording",
    OPEN_SIDE_PANEL: "open-side-panel",
    TOGGLE_QUICK_ACTIONS: "toggle-quick-actions",
  };

  private static isPanelOpen = false;

  constructor(protected readonly emitter: Emitter) {
    super("ShortcutService", emitter);
  }

  init(): Promise<void> {
    this.logger.info("ShortcutService initialized");

    chrome.commands.onCommand.addListener((command) => {
      this.onCommandListener(command);
    });

    void chrome.sidePanel.setPanelBehavior({
      openPanelOnActionClick: true,
    });

    chrome.sidePanel.onOpened.addListener(() => {
      ShortcutService.isPanelOpen = true;
      this.logger.info("Side panel opened");
    });

    return Promise.resolve();
  }

  onCommandListener(command: string): void {
    switch (command) {
      case ShortcutService.commands.START_RECORDING:
        this.startRecording();
        break;

      case ShortcutService.commands.STOP_RECORDING:
        this.emitter.emit("STOP_RECORDING", {}, { currentTab: false });
        break;
      case ShortcutService.commands.OPEN_SIDE_PANEL:
        ShortcutService.toggleSidePanel();
        break;
      case ShortcutService.commands.TOGGLE_QUICK_ACTIONS:
        this.emitter.emit("TOGGLE_QUICK_ACTIONS");
        break;
      default:
        this.logger.warn(`Unhandled command: ${command}`);
    }
  }

  private startRecording(): void {
    const sessionId = MacroUtils.generateSessionId();

    // Get the active tab URL and tabId
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currTab = tabs[0];
      const initialUrl = currTab.url;
      const tabId = currTab.id;

      if (initialUrl === undefined || tabId === undefined) {
        this.logger.error("Cannot start recording: no active tab found");
        return;
      }

      this.emitter.emit("START_RECORDING", {
        sessionId,
        initialUrl,
        tabId,
      });
    });
  }

  private static async openSidePanel(
    tabId: number,
    windowId?: number
  ): Promise<void> {
    await chrome.sidePanel.open({ tabId, windowId });
  }

  private static async closeSidePanel(): Promise<void> {
    await chrome.sidePanel.setOptions({ enabled: false });
    await chrome.sidePanel.setOptions({ enabled: true });
    ShortcutService.isPanelOpen = false;
  }

  static toggleSidePanel(): void {
    void chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;

      if (!tabId) {
        console.warn("No active tab found to toggle side panel");
        return;
      }

      /*
       * currently, chrome.sidePanel API does not provide a direct method to check if the side panel is open for a specific tab.
       * As a workaround, we maintain the state within the ShortcutService class.
       * https://github.com/w3c/webextensions/issues/521#issuecomment-2560936431
       */
      if (ShortcutService.isPanelOpen) {
        void ShortcutService.closeSidePanel();
      } else {
        void ShortcutService.openSidePanel(tabId);
      }
    });
  }
}
