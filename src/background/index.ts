import { App } from "@/utils/App";

const app: App = App.create();
app.init();

// Bridge runtime messages from content script into the emitter
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "USER_ACTION") {
    app.logger.info("USER_ACTION received from content script", {
      data: message.data,
    });
    app.emitter.emit("USER_ACTION", message.data);
    sendResponse({ status: "ok" });
  }
  return true;
});
