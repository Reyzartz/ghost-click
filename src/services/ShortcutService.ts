import { Emitter } from "@/utils/Emitter";
import { EventTypes } from "@/utils/Event";
import { Logger } from "@/utils/Logger";

export class ShortcutService {
  private static commands = {
    START_RECORDING: "start-recording",
  };
  private logger: Logger;

  constructor(private readonly emitter: Emitter) {
    this.logger = new Logger("ShortcutService");
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
