import { Emitter } from "./Emitter";
import { Logger } from "./Logger";

export class App {
  emitter: Emitter;
  logger: Logger;

  constructor(emitter: Emitter, logger: Logger) {
    this.emitter = emitter;
    this.logger = logger;
  }

  init(): void {
    this.logger.info("App initialized");
  }

  static create(): App {
    const emitter = new Emitter();
    const logger = new Logger("App");
    return new App(emitter, logger);
  }
}
