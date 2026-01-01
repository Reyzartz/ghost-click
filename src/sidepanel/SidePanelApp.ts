import { BaseApp } from "@/utils/BaseApp";
import { Emitter } from "@/utils/Emitter";
import { Logger } from "@/utils/Logger";
import { Storage } from "@/utils/Storage";
import { MacroRepository } from "@/repositories/MacroRepository";
import { MacroListViewModel } from "./viewmodels/MacroListViewModel";

export class SidePanelApp extends BaseApp {
  readonly macroRepository: MacroRepository;
  readonly macroListViewModel: MacroListViewModel;

  constructor() {
    const emitter = new Emitter("sidepanel");
    const logger = new Logger("SidePanelApp");
    const storage = new Storage(chrome.storage.local);
    const macroRepository = new MacroRepository(emitter, storage);
    const macroListViewModel = new MacroListViewModel(macroRepository, emitter);

    super(emitter, logger, []);

    this.macroRepository = macroRepository;
    this.macroListViewModel = macroListViewModel;
  }

  async init(): Promise<void> {
    this.logger.info("SidePanelApp initialized");
    await this.macroListViewModel.init();
  }
}
