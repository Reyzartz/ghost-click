import { BaseService } from "@/utils/BaseService";
import { Emitter } from "@/utils/Emitter";
import { UserClickEventData } from "@/utils/Event";

export class UserInputService extends BaseService {
  private isRecording = false;
  private currentSessionId: string | null = null;
  private clickHandler: ((event: MouseEvent) => void) | null = null;

  constructor(protected readonly emitter: Emitter) {
    super("UserInputService", emitter);
  }

  init(): void {
    this.logger.info("UserInputService initialized");

    this.emitter.on("START_RECORDING", (data) => {
      this.startCapture(data.sessionId);
    });

    this.emitter.on("STOP_RECORDING", () => {
      this.stopCapture();
    });
  }

  private startCapture(sessionId: string): void {
    if (this.isRecording) {
      this.logger.warn("Already capturing user input");
      return;
    }

    this.isRecording = true;
    this.currentSessionId = sessionId;
    this.logger.info("Started capturing user input", { sessionId });

    this.clickHandler = (event: MouseEvent) => {
      this.captureClick(event);
    };

    document.addEventListener("click", this.clickHandler, true);
  }

  private stopCapture(): void {
    if (!this.isRecording) {
      this.logger.warn("Not currently capturing");
      return;
    }

    this.logger.info("Stopped capturing user input", {
      sessionId: this.currentSessionId,
    });

    if (this.clickHandler) {
      document.removeEventListener("click", this.clickHandler, true);
      this.clickHandler = null;
    }

    this.isRecording = false;
    this.currentSessionId = null;
  }

  private captureClick(event: MouseEvent): void {
    if (!this.isRecording || !this.currentSessionId) {
      return;
    }

    const target = event.target as HTMLElement;
    const clickData: UserClickEventData = {
      sessionId: this.currentSessionId,
      timestamp: Date.now(),
      type: "CLICK",
      target: {
        id: target.id || "",
        className: target.className || "",
        xpath: this.getXPath(target),
      },
    };

    this.logger.info("Click captured", clickData);

    // Emit USER_ACTION event
    this.emitter.emit("USER_ACTION", clickData);
  }

  private getXPath(element: HTMLElement): string {
    const paths: string[] = [];
    let current: HTMLElement | null = element;

    while (current && current.nodeType === Node.ELEMENT_NODE) {
      let index = 0;
      let sibling: Node | null = current.previousSibling;

      while (sibling) {
        if (
          sibling.nodeType === Node.ELEMENT_NODE &&
          (sibling as HTMLElement).tagName === current.tagName
        ) {
          index++;
        }
        sibling = sibling.previousSibling;
      }

      const tagName = current.tagName.toLowerCase();
      const pathIndex = index > 0 ? `[${index + 1}]` : "";
      paths.unshift(`${tagName}${pathIndex}`);

      current = current.parentElement;
    }

    return `/${paths.join("/")}`;
  }
}
