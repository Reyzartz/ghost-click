import { BaseService } from "./BaseService";
import { Emitter } from "./Emitter";

/*
 * currently, chrome.sidePanel API does not provide a direct method to check if the side panel is open for a specific tab.
 * As a workaround, we maintain the state within the SidepanelStateService class.
 * https://github.com/w3c/webextensions/issues/521#issuecomment-2560936431
 */
export class SidepanelStateService extends BaseService {
  private isPanelOpen = false;

  constructor(protected readonly emitter: Emitter) {
    super("SidepanelStateService", emitter);
  }

  async init(): Promise<void> {
    this.logger.info("SidepanelStateService initialized");

    this.emitter.on("OPEN_SIDE_PANEL", () => {
      this.openSidePanel();
    });

    await chrome.sidePanel.setPanelBehavior({
      openPanelOnActionClick: true,
    });

    chrome.sidePanel.onOpened.addListener(() => {
      this.isPanelOpen = true;
      this.logger.info("Side panel opened");
    });
  }

  openSidePanel(): void {
    /**
     * Currently, the sidepanel only be called in response to a user action.
     * so we can't use any async await here. so using TabManager is not possible.
     * https://stackoverflow.com/questions/77213045/error-sidepanel-open-may-only-be-called-in-response-to-a-user-gesture-re
     */
    void chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;

      if (!tabId) {
        this.logger.warn("No active tab found to toggle side panel");
        return;
      }

      void chrome.sidePanel.open({ tabId });
    });
  }

  async closeSidePanel(): Promise<void> {
    await chrome.sidePanel.setOptions({ enabled: false });
    await chrome.sidePanel.setOptions({ enabled: true });
    this.isPanelOpen = false;
    this.logger.info("Side panel closed");
  }

  async toggleSidePanel(): Promise<void> {
    if (this.isPanelOpen) {
      await this.closeSidePanel();
    } else {
      this.openSidePanel();
    }
  }

  getIsPanelOpen(): boolean {
    return this.isPanelOpen;
  }
}
