import { BaseService } from "@/utils/BaseService";
import { Emitter } from "@/utils/Emitter";

/**
 * Add this to the background script to listen for tab events and emit them through the central emitter.
 * This allows other parts of the extension to react to tab changes, updates, and removals without directly using the Chrome Tabs API.
 * This also prevent duplicate event listeners, without worring to clean them up, since the background script is long-lived and only initialized once.
 */
export class TabEventService extends BaseService {
  constructor(protected readonly emitter: Emitter) {
    super("TabEventService", emitter);
  }

  init(): Promise<void> {
    this.logger.info("TabEventService initialized");

    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      this.emitter.emit("TAB_UPDATED", { tabId, changeInfo, tab });
    });

    chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
      this.emitter.emit("TAB_REMOVED", { tabId, removeInfo });
    });

    chrome.tabs.onActivated.addListener((activeInfo) => {
      this.emitter.emit("TAB_ACTIVATED", { activeInfo });
    });

    chrome.tabs.onCreated.addListener((tab) => {
      this.emitter.emit("TAB_CREATED", { tab });
    });

    return Promise.resolve();
  }
}
