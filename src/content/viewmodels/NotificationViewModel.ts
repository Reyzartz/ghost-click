import { BaseViewModel } from "@/utils/BaseViewModel";
import { Emitter } from "@/utils/Emitter";

export interface Notification {
  id: string;
  message: string;
  type: "success" | "error" | "info";
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

  init(): void {
    this.logger.info("Initializing notification view model");

    this.emitter.on("START_RECORDING", () => {
      this.showNotification("Recording started", "info");
    });

    this.emitter.on("SAVED_MACRO", () => {
      this.showNotification("Recording saved", "success");
    });

    this.emitter.on("PLAY_MACRO", () => {
      this.showNotification("Playback started", "info");
    });

    this.emitter.on("PLAYBACK_COMPLETED", () => {
      this.showNotification("Playback stopped", "success");
    });

    this.emitter.on("PLAYBACK_ERROR", () => {
      this.showNotification("Playback errored", "error");
    });
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
    type: "success" | "error" | "info"
  ): void {
    const id = `${Date.now()}-${Math.random()}`;
    const notification: Notification = { id, message, type };

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
