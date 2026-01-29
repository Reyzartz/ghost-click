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
}
