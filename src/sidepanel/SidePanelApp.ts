import { BaseApp } from "@/utils/BaseApp";
import { Emitter } from "@/utils/Emitter";
import { Logger } from "@/utils/Logger";
import { Storage } from "@/utils/Storage";
import { MacroRepository } from "@/repositories/MacroRepository";
import { PlaybackStateRepository } from "@/repositories/PlaybackStateRepository";
import { MacroListViewModel } from "./viewmodels/MacroListViewModel";
import { PlaybackProgressViewModel } from "./viewmodels/PlaybackProgressViewModel";
import { EditMacroViewModel } from "./viewmodels/EditMacroViewModel";
import { ViewService } from "./services/ViewService";
import { RecordingStateRepository } from "@/repositories/RecordingStateRepository";

export class SidePanelApp extends BaseApp {
  readonly macroRepository: MacroRepository;
  readonly playbackStateRepository: PlaybackStateRepository;
  readonly recordingStateRepository: RecordingStateRepository;
  readonly macroListViewModel: MacroListViewModel;
  readonly playbackProgressViewModel: PlaybackProgressViewModel;
  readonly editMacroViewModel: EditMacroViewModel;
  readonly viewService: ViewService;

  constructor() {
    const emitter = new Emitter("sidepanel");
    const logger = new Logger("SidePanelApp");
    const storage = new Storage(chrome.storage.local);
    const macroRepository = new MacroRepository(emitter, storage);
    const playbackStateRepository = new PlaybackStateRepository(storage);
    const recordingStateRepository = new RecordingStateRepository(storage);
    const viewService = new ViewService(emitter, playbackStateRepository);
    const macroListViewModel = new MacroListViewModel(
      macroRepository,
      recordingStateRepository,
      emitter,
    );
    const playbackProgressViewModel = new PlaybackProgressViewModel(
      macroRepository,
      playbackStateRepository,
      emitter,
    );
    const editMacroViewModel = new EditMacroViewModel(
      macroRepository,
      playbackStateRepository,
      emitter,
    );

    super(emitter, logger, [viewService]);

    this.macroRepository = macroRepository;
    this.playbackStateRepository = playbackStateRepository;
    this.recordingStateRepository = recordingStateRepository;
    this.viewService = viewService;
    this.macroListViewModel = macroListViewModel;
    this.playbackProgressViewModel = playbackProgressViewModel;
    this.editMacroViewModel = editMacroViewModel;
  }

  async init(): Promise<void> {
    this.logger.info("SidePanelApp initialized");
    await super.init(); // Initialize all services including viewService
    await this.macroListViewModel.init();
    await this.playbackProgressViewModel.init();
    await this.editMacroViewModel.init();
  }
}
