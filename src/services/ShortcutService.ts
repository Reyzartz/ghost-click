import { EventTypes } from "@/utils/Event";
import { BaseService } from "./BaseService";
import { Emitter } from "@/utils/Emitter";

export class ShortcutService extends BaseService {
  private static commands = {
    START_RECORDING: "start-recording",
  };

  constructor(protected readonly emitter: Emitter) {
    super("ShortcutService", emitter);
  }

  init(): void {
    this.logger.info("ShortcutService initialized");

    chrome.commands.onCommand.addListener((command) => {
      this.onCommandListener(command);
    });
  }

  onCommandListener(command: string): void {
    switch (command) {
      case ShortcutService.commands.START_RECORDING:
        const sessionId = crypto.randomUUID();

        this.emitter.emit(EventTypes.START_RECORDING, {
          sessionId,
        });
        break;
      default:
        this.logger.warn(`Unhandled command: ${command}`);
    }
  }
}
