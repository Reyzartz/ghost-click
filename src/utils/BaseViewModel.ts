import { Emitter } from "@/utils/Emitter";
import { Logger } from "@/utils/Logger";

export class BaseViewModel {
  protected logger: Logger;

  constructor(viewModelName: string, protected readonly emitter: Emitter) {
    this.logger = new Logger(viewModelName);
  }

  init(): void {}
}
