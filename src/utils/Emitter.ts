import {
  EventType,
  ExecuteActionEvent,
  PlaybackCompletedEvent,
  PlaybackErrorEvent,
  PlayMacroEvent,
  SavedMacroEvent,
  StartRecordingEvent,
  StopRecordingEvent,
  ToggleQuickActionsEvent,
  UserActionEvent,
} from "./Event";
import { Logger } from "./Logger";

type Events =
  | StartRecordingEvent
  | StopRecordingEvent
  | UserActionEvent
  | SavedMacroEvent
  | PlayMacroEvent
  | ExecuteActionEvent
  | PlaybackCompletedEvent
  | PlaybackErrorEvent
  | ToggleQuickActionsEvent;

type EventOf<T extends EventType> = Extract<Events, { name: T }>;

type EventDispatcher<T extends EventType> = (data: EventOf<T>["data"]) => void;

interface ChromeMessage<T extends EventType = EventType> {
  type: "EMIT_EVENT";
  event: T;
  data?: EventOf<T>["data"];
  source: "background" | "content" | "popup" | "sidepanel";
}

interface EmitOptions {
  currentTab?: boolean;
}

export class Emitter {
  logger: Logger;
  private events: { [K in EventType]?: Array<EventDispatcher<K>> } = {};
  private messageListenerSetup = false;

  constructor(
    private readonly appType: "background" | "content" | "popup" | "sidepanel"
  ) {
    this.logger = new Logger(`${this.appType}/Emitter`);
    this.setupChromeMessageListener();
  }

  /**
   * Set up Chrome message listener to receive events from other contexts
   */
  private setupChromeMessageListener(): void {
    if (this.messageListenerSetup) return;

    chrome.runtime.onMessage.addListener(
      (message: ChromeMessage, _sender, sendResponse) => {
        if (message.type === "EMIT_EVENT") {
          this.logger.info(
            `Received event '${message.event}' from ${message.source}`,
            { data: message.data }
          );

          this.emitLocally(message.event, message.data);

          sendResponse({ status: "ok" });
        }
        return true;
      }
    );

    this.messageListenerSetup = true;
  }

  on<T extends EventType>(event: T, listener: EventDispatcher<T>): void {
    this.logger.info(`Listener added for event: ${event}`);

    if (this.events[event] === undefined) {
      this.events[event] = [];
    }

    this.events[event].push(listener);
  }

  off<T extends EventType>(event: T, listener: EventDispatcher<T>): void {
    if (this.events[event] === undefined) return;

    this.logger.info(`Listener removed for event: ${event}`);

    const listeners = this.events[event] as EventDispatcher<T>[] | undefined;
    if (listeners) {
      this.events[event] = listeners.filter((l) => l !== listener) as any;
    }
  }

  emit<T extends EventType>(
    event: T,
    data?: EventOf<T>["data"],
    options?: EmitOptions
  ): void {
    this.logger.info(`Emitting event: ${event}`, { data });

    this.emitLocally(event, data);

    this.bridgeToOtherContexts(event, data, options);
  }

  private emitLocally<T extends EventType>(
    event: T,
    data?: EventOf<T>["data"]
  ): void {
    if (this.events[event] === undefined) return;

    this.events[event].forEach((listener) =>
      listener(data as EventOf<T>["data"])
    );
  }

  /**
   * Bridge events to other contexts using Chrome message passing
   */
  private bridgeToOtherContexts<T extends EventType>(
    event: T,
    data?: EventOf<T>["data"],
    { currentTab = true }: EmitOptions = {}
  ): void {
    const message: ChromeMessage<T> = {
      type: "EMIT_EVENT",
      event,
      data,
      source: this.appType,
    };

    if (this.appType === "content") {
      // Content script sends to background
      chrome.runtime.sendMessage(message).catch((err) => {
        this.logger.info("Failed to send message to background", {
          error: err,
        });
      });
    } else {
      if (currentTab) {
        this.sendMessageToCurrentTab(message);
      } else {
        this.sendMessageToAllTabs(message);
      }

      // Also notify extension pages (popup/sidepanel/options)
      chrome.runtime.sendMessage(message).catch((err) => {
        this.logger.info(`Failed to send message from ${this.appType}`, {
          error: err,
        });
      });
    }
  }

  private sendMessageToCurrentTab<T extends EventType>(
    message: ChromeMessage<T>
  ): void {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      (tabs) => {
        tabs.forEach((tab) => {
          if (tab.id === undefined) return;

          chrome.tabs.sendMessage(tab.id, message).catch((err) => {
            this.logger.info(
              `Failed to send message to content script in tab ${tab.id}`,
              { error: err }
            );
          });
        });
      }
    );
  }

  private sendMessageToAllTabs<T extends EventType>(
    message: ChromeMessage<T>
  ): void {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.id === undefined) return;

        chrome.tabs.sendMessage(tab.id, message).catch((err) => {
          this.logger.info(
            `Failed to send message to content script in tab ${tab.id}`,
            { error: err }
          );
        });
      });
    });
  }
}
