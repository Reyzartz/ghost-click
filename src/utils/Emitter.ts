import { EventType, StartRecordingEvent } from "./Event";
import { Logger } from "./Logger";

type Events = StartRecordingEvent;

type EventOf<T extends EventType> = Extract<Events, { name: T }>;

type EventDispatcher<T extends EventType> = (data: EventOf<T>["data"]) => void;

export class Emitter {
  logger: Logger;

  constructor() {
    this.logger = new Logger("Emitter");
  }

  private events: Partial<{ [K in EventType]: Array<EventDispatcher<K>> }> = {};

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

    this.events[event] = this.events[event].filter((l) => l !== listener);
  }

  emit<T extends EventType>(event: T, data?: EventOf<T>["data"]): void {
    this.logger.info(`Emitting event: ${event}`);

    if (this.events[event] === undefined) return;

    this.events[event].forEach((listener) =>
      listener(data as EventOf<T>["data"])
    );
  }
}
