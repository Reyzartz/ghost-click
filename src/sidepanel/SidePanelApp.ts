import { BaseApp } from "@/utils/BaseApp";
import { Emitter } from "@/utils/Emitter";
import { Logger } from "@/utils/Logger";
import { Storage } from "@/utils/Storage";
import { MacroRepository } from "@/repositories/MacroRepository";
import { PlaybackStateRepository } from "@/repositories/PlaybackStateRepository";
import { SettingsRepository } from "@/repositories/SettingsRepository";
import { MacroListViewModel } from "./viewmodels/MacroListViewModel";
import { PlaybackProgressViewModel } from "./viewmodels/PlaybackProgressViewModel";
import { RecordingProgressViewModel } from "./viewmodels/RecordingProgressViewModel";
import { EditMacroViewModel } from "./viewmodels/EditMacroViewModel";
import { ImportMacroViewModel } from "./viewmodels/ImportMacroViewModel";
import { DuplicateMacroViewModel } from "./viewmodels/DuplicateMacroViewModel";
import { SaveRecordingViewModel } from "./viewmodels/SaveRecordingViewModel";
import { SettingsViewModel } from "./viewmodels/SettingsViewModel";
import { ViewService } from "./services/ViewService";
import { RecordingStateRepository } from "@/repositories/RecordingStateRepository";
import { MacroShareService } from "@/sidepanel/services/MacroShareService";
import { ThemeService } from "@/sidepanel/services/ThemeService";

export class SidePanelApp extends BaseApp {
  readonly macroRepository: MacroRepository;
  readonly playbackStateRepository: PlaybackStateRepository;
  readonly recordingStateRepository: RecordingStateRepository;
  readonly settingsRepository: SettingsRepository;
  readonly macroShareService: MacroShareService;
  readonly themeService: ThemeService;
  readonly macroListViewModel: MacroListViewModel;
  readonly playbackProgressViewModel: PlaybackProgressViewModel;
  readonly recordingProgressViewModel: RecordingProgressViewModel;
  readonly editMacroViewModel: EditMacroViewModel;
  readonly importMacroViewModel: ImportMacroViewModel;
  readonly duplicateMacroViewModel: DuplicateMacroViewModel;
  readonly saveRecordingViewModel: SaveRecordingViewModel;
  readonly settingsViewModel: SettingsViewModel;
  readonly viewService: ViewService;

  constructor() {
    const emitter = new Emitter("sidepanel");
    const logger = new Logger("SidePanelApp");
    const storage = new Storage(chrome.storage.local);
    const macroRepository = new MacroRepository(emitter, storage);
    const playbackStateRepository = new PlaybackStateRepository(storage);
    const recordingStateRepository = new RecordingStateRepository(storage);
    const settingsRepository = new SettingsRepository(storage);
    const macroShareService = new MacroShareService(emitter);
    const viewService = new ViewService(
      emitter,
      playbackStateRepository,
      recordingStateRepository
    );
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
    const recordingProgressViewModel = new RecordingProgressViewModel(
      recordingStateRepository,
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
    const duplicateMacroViewModel = new DuplicateMacroViewModel(
      macroRepository,
      emitter
    );
    const saveRecordingViewModel = new SaveRecordingViewModel(emitter);
    const settingsViewModel = new SettingsViewModel(
      settingsRepository,
      emitter
    );
    const themeService = new ThemeService(settingsRepository, emitter);

    super(emitter, logger, [viewService, themeService]);

    this.macroRepository = macroRepository;
    this.playbackStateRepository = playbackStateRepository;
    this.recordingStateRepository = recordingStateRepository;
    this.settingsRepository = settingsRepository;
    this.macroShareService = macroShareService;
    this.themeService = themeService;
    this.viewService = viewService;
    this.macroListViewModel = macroListViewModel;
    this.playbackProgressViewModel = playbackProgressViewModel;
    this.recordingProgressViewModel = recordingProgressViewModel;
    this.editMacroViewModel = editMacroViewModel;
    this.importMacroViewModel = importMacroViewModel;
    this.duplicateMacroViewModel = duplicateMacroViewModel;
    this.saveRecordingViewModel = saveRecordingViewModel;
    this.settingsViewModel = settingsViewModel;
  }

  async init(): Promise<void> {
    this.logger.info("SidePanelApp initialized");
    await super.init();
    // Initialize all services including viewService
    await this.macroShareService.init();
    await this.macroListViewModel.init();
    await this.playbackProgressViewModel.init();
    await this.recordingProgressViewModel.init();
    await this.editMacroViewModel.init();
    await this.importMacroViewModel.init();
    await this.duplicateMacroViewModel.init();
    await this.saveRecordingViewModel.init();
    await this.settingsViewModel.init();
  }
}
