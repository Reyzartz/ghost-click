import { BaseService } from "../../utils/BaseService";
import { Emitter } from "@/utils/Emitter";

export class ShortcutService extends BaseService {
  private static commands = {
    START_RECORDING: "start-recording",
    STOP_RECORDING: "stop-recording",
    OPEN_SIDE_PANEL: "open-side-panel",
  };

  constructor(protected readonly emitter: Emitter) {
    super("ShortcutService", emitter);
  }

  init(): void {
    this.logger.info("ShortcutService initialized");

    chrome.commands.onCommand.addListener((command) => {
      this.onCommandListener(command);
    });
  }

  onCommandListener(command: string): void {
    switch (command) {
      case ShortcutService.commands.START_RECORDING:
        const sessionId = crypto.randomUUID();

        // Get the active tab URL
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const initialUrl = tabs[0]?.url || "";
          this.emitter.emit("START_RECORDING", {
            sessionId,
            initialUrl,
          });
        });
        break;

      case ShortcutService.commands.STOP_RECORDING:
        this.emitter.emit("STOP_RECORDING");
        break;
      case ShortcutService.commands.OPEN_SIDE_PANEL:
        ShortcutService.toggleSidePanel();
        break;
      default:
        this.logger.warn(`Unhandled command: ${command}`);
    }
  }

  static toggleSidePanel(): void {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;

      if (!tabId) {
        console.warn("No active tab found to toggle side panel");
        return;
      }

      chrome.sidePanel.open({
        tabId,
      });

      console.info("Toggled side panel", {
        tabId,
      });
    });
  }
}
