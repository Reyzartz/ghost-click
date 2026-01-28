import { BaseApp } from "@/utils/BaseApp";
import { Emitter } from "@/utils/Emitter";
import { Logger } from "@/utils/Logger";
import { Storage } from "@/utils/Storage";
import { MacroRepository } from "@/repositories/MacroRepository";
import { PlaybackStateRepository } from "@/repositories/PlaybackStateRepository";
import { MacroListViewModel } from "./viewmodels/MacroListViewModel";
import { PlaybackProgressViewModel } from "./viewmodels/PlaybackProgressViewModel";
import { EditMacroViewModel } from "./viewmodels/EditMacroViewModel";
import { ImportMacroViewModel } from "./viewmodels/ImportMacroViewModel";
import { ViewService } from "./services/ViewService";
import { RecordingStateRepository } from "@/repositories/RecordingStateRepository";
import { MacroShareService } from "@/services/MacroShareService";

export class SidePanelApp extends BaseApp {
  readonly macroRepository: MacroRepository;
  readonly playbackStateRepository: PlaybackStateRepository;
  readonly recordingStateRepository: RecordingStateRepository;
  readonly macroShareService: MacroShareService;
  readonly macroListViewModel: MacroListViewModel;
  readonly playbackProgressViewModel: PlaybackProgressViewModel;
  readonly editMacroViewModel: EditMacroViewModel;
  readonly importMacroViewModel: ImportMacroViewModel;
  readonly viewService: ViewService;

  constructor() {
    const emitter = new Emitter("sidepanel");
    const logger = new Logger("SidePanelApp");
    const storage = new Storage(chrome.storage.local);
    const macroRepository = new MacroRepository(emitter, storage);
    const playbackStateRepository = new PlaybackStateRepository(storage);
    const recordingStateRepository = new RecordingStateRepository(storage);
    const macroShareService = new MacroShareService(emitter);
    const viewService = new ViewService(emitter, playbackStateRepository);
    const macroListViewModel = new MacroListViewModel(
      macroRepository,
      recordingStateRepository,
      macroShareService,
      emitter
    );
    const playbackProgressViewModel = new PlaybackProgressViewModel(
      macroRepository,
      playbackStateRepository,
      emitter
    );
    const editMacroViewModel = new EditMacroViewModel(
      macroRepository,
      playbackStateRepository,
      emitter
    );
    const importMacroViewModel = new ImportMacroViewModel(
      macroRepository,
      macroShareService,
      emitter
    );

    super(emitter, logger, [viewService]);

    this.macroRepository = macroRepository;
    this.playbackStateRepository = playbackStateRepository;
    this.recordingStateRepository = recordingStateRepository;
    this.macroShareService = macroShareService;
    this.viewService = viewService;
    this.macroListViewModel = macroListViewModel;
    this.playbackProgressViewModel = playbackProgressViewModel;
    this.editMacroViewModel = editMacroViewModel;
    this.importMacroViewModel = importMacroViewModel;
  }

  async init(): Promise<void> {
    this.logger.info("SidePanelApp initialized");
    await super.init();
    // Initialize all services including viewService
    await this.macroShareService.init();
    await this.macroListViewModel.init();
    await this.playbackProgressViewModel.init();
    await this.editMacroViewModel.init();
    await this.importMacroViewModel.init();
  }
}
