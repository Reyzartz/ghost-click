export class TabsManager {
  static async getActiveTab(): Promise<chrome.tabs.Tab | null> {
    try {
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      return tabs[0] ?? null;
    } catch (err) {
      console.error("Failed to get active tab ID", err);
      return null;
    }
  }

  static async navigate(tabId: number, url: string): Promise<void> {
    try {
      await chrome.tabs.update(tabId, { url });
    } catch (err) {
      console.error("Failed to navigate to URL", { tabId, url, error: err });
      throw err;
    }
  }

  static async waitForTabLoad(
    tabId: number,
    timeout: number = 10000
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        chrome.tabs.onUpdated.removeListener(onUpdated);
        reject(new Error("Tab load timed out"));
      }, timeout);

      const onUpdated = (
        updatedTabId: number,
        changeInfo: chrome.tabs.OnUpdatedInfo
      ) => {
        if (updatedTabId === tabId && changeInfo.status === "complete") {
          clearTimeout(timeoutId);
          chrome.tabs.onUpdated.removeListener(onUpdated);
          resolve();
        }
      };

      chrome.tabs.onUpdated.addListener(onUpdated);
    });
  }
}
