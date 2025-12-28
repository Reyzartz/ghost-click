// Background service worker for ghost-click extension
console.log("[GHOST-CLICK] Background service worker initialized");

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log("[GHOST-CLICK] Extension installed:", details.reason);

  if (details.reason === "install") {
    console.log("[GHOST-CLICK] First time installation");
  } else if (details.reason === "update") {
    console.log("[GHOST-CLICK] Extension updated");
  }

  // Enable and set default side panel path
  try {
    if (chrome.sidePanel) {
      chrome.sidePanel.setOptions({
        enabled: true,
        path: "src/sidepanel/index.html",
      });
      console.log("[GHOST-CLICK] Side panel options set");
    }
  } catch (err) {
    console.warn("[GHOST-CLICK] Failed to set side panel options", err);
  }
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("[GHOST-CLICK] Message received:", message, "from:", sender);

  // Handle different message types
  if (message.type === "PING") {
    sendResponse({ type: "PONG", status: "ok" });
  }

  // Return true to indicate async response
  return true;
});

// Listen for tab updates to inject content script if needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    console.log("[GHOST-CLICK] Tab updated:", tabId, tab.url);
  }
});
