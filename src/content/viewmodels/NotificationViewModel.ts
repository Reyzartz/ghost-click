import { BaseViewModel } from "@/utils/BaseViewModel";
import { Emitter } from "@/utils/Emitter";

export type NotificationIcon =
  | "circle-dot"
  | "save"
  | "play"
  | "square"
  | "check-circle"
  | "x-circle"
  | "info";

export interface Notification {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  icon: NotificationIcon;
}

export interface NotificationState {
  notifications: Notification[];
}

export class NotificationViewModel extends BaseViewModel {
  private state: NotificationState = { notifications: [] };
  private listeners: Array<(state: NotificationState) => void> = [];

  constructor(protected readonly emitter: Emitter) {
    super("NotificationViewModel", emitter);
  }

  async init(): Promise<void> {
    this.logger.info("Initializing notification view model");

    this.emitter.on("START_RECORDING", () => {
      /**
       * Recording state is not an error, this is just to show a red popup
       * */
      this.showNotification("Recording started", "error", "circle-dot");
    });

    this.emitter.on("STOP_RECORDING", () => {
      this.showNotification("Recording stopped", "info", "square");
    });

    this.emitter.on("CANCEL_RECORDING", () => {
      this.showNotification("Recording cancelled", "error", "x-circle");
    });

    this.emitter.on("SAVED_MACRO", () => {
      this.showNotification("Recording saved", "success", "save");
    });

    this.emitter.on("PLAY_MACRO", () => {
      this.showNotification("Playback started", "info", "play");
    });

    this.emitter.on("PLAYBACK_COMPLETED", () => {
      this.showNotification("Playback completed", "success", "check-circle");
    });

    this.emitter.on("PLAYBACK_ERROR", () => {
      this.showNotification("Playback errored", "error", "x-circle");
    });

    this.emitter.on("RESUME_PLAYBACK", () => {
      this.showNotification("Playback resumed", "info", "play");
    });

    this.emitter.on("STOP_PLAYBACK", () => {
      this.showNotification("Playback stopped", "info", "square");
    });

    return Promise.resolve();
  }

  subscribe(listener: (state: NotificationState) => void): () => void {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private setState(next: Partial<NotificationState>): void {
    this.state = { ...this.state, ...next };
    this.listeners.forEach((l) => l(this.state));
  }

  private showNotification(
    message: string,
    type: "success" | "error" | "info",
    icon: NotificationIcon
  ): void {
    const id = `${Date.now()}-${Math.random()}`;
    const notification: Notification = { id, message, type, icon };

    this.logger.info("Showing notification", { notification });

    this.setState({
      notifications: [...this.state.notifications, notification],
    });

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      this.dismissNotification(id);
    }, 3000);
  }

  dismissNotification(id: string): void {
    this.logger.info("Dismissing notification", { id });
    this.setState({
      notifications: this.state.notifications.filter((n) => n.id !== id),
    });
  }
}
