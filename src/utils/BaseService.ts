import { Emitter } from "@/utils/Emitter";
import { Logger } from "@/utils/Logger";

export class BaseService {
  protected logger: Logger;

  constructor(serviceName: string, protected readonly emitter: Emitter) {
    this.logger = new Logger(serviceName);
  }

  async init(): Promise<void> {}
}
