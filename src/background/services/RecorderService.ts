import { Macro } from "@/models";
import { MacroRepository } from "@/repositories/MacroRepository";
import { RecordingStateRepository } from "@/repositories/RecordingStateRepository";
import { SettingsRepository } from "@/repositories/SettingsRepository";
import { BaseService } from "../../utils/BaseService";
import { Emitter } from "@/utils/Emitter";
import {
  SaveRecordingCancelledEvent,
  SaveRecordingConfirmedEvent,
  UserActionEvent,
} from "@/utils/Event";
import { MacroUtils } from "@/utils/MacroUtils";

export class RecorderService extends BaseService {
  private isRecording = false;
  private currentSessionId: string | null = null;
  private recordingTabId: number | null = null;
  private currentMacro: Macro | null = null;

  constructor(
    protected readonly emitter: Emitter,
    private readonly macroRepository: MacroRepository,
    private readonly recordingStateRepository: RecordingStateRepository,
    private readonly settingsRepository: SettingsRepository
  ) {
    super("RecorderService", emitter);
  }

  init(): Promise<void> {
    this.logger.info("RecorderService initialized");

    void this.setInitialRecordingState();

    this.emitter.on("START_RECORDING", (data) => {
      void this.startRecording(data.sessionId, data.domain, data.tabId);
    });

    this.emitter.on("STOP_RECORDING", () => {
      void this.stopRecording();
    });

    this.emitter.on("USER_ACTION", (data) => {
      void this.recordUserAction(data);
    });

    this.emitter.on("SAVE_RECORDING_CONFIRMED", (data) => {
      void this.handleSaveRecordingConfirmed(data);
    });

    this.emitter.on("SAVE_RECORDING_CANCELLED", (data) => {
      this.handleSaveRecordingCancelled(data);
    });

    // Listen for tab close to stop recording
    chrome.tabs.onRemoved.addListener((tabId) => {
      if (this.isRecording && this.recordingTabId === tabId) {
        this.logger.info("Recording tab closed, stopping recording", { tabId });
        void this.stopRecording();
      }
    });

    return Promise.resolve();
  }

  private async setInitialRecordingState(): Promise<void> {
    const recordingState = await this.recordingStateRepository.get();

    if (recordingState?.isRecording && recordingState.macro) {
      this.isRecording = true;
      this.currentSessionId = recordingState.sessionId;
      this.recordingTabId = recordingState.tabId;
      this.currentMacro = recordingState.macro;
      this.logger.info("Restored recording state from repository", {
        sessionId: this.currentSessionId,
        tabId: this.recordingTabId,
        stepsCount: this.currentMacro.steps.length,
      });
    }
  }

  private startRecording(
    sessionId: string,
    domain: string,
    tabId?: number
  ): void {
    if (this.isRecording) {
      this.logger.warn("Recording already in progress", {
        currentSessionId: this.currentSessionId,
      });
      return;
    }

    this.isRecording = true;
    this.currentSessionId = sessionId;
    this.recordingTabId = tabId ?? null;

    const faviconUrl = MacroUtils.getFaviconFromURL(domain);

    // Create initial macro object
    this.currentMacro = MacroUtils.createInitialMacro({
      id: sessionId,
      name: MacroUtils.getDefaultMacroName(),
      domain,
      faviconUrl,
    });

    this.logger.info("Recording started", { sessionId, domain, tabId });

    void this.recordingStateRepository.save({
      isRecording: true,
      sessionId,
      tabId: this.recordingTabId,
      macro: this.currentMacro,
    });
  }

  private async stopRecording(): Promise<void> {
    if (!this.isRecording) {
      this.logger.warn("No recording in progress");
      return;
    }

    if (!this.currentSessionId || !this.currentMacro) {
      this.logger.warn("Missing session id or macro while stopping recording");
      this.isRecording = false;
      this.currentMacro = null;
      this.recordingTabId = null;
      await this.recordingStateRepository.clear();
      return;
    }

    this.logger.info("Recording stopped", { sessionId: this.currentSessionId });

    // Create a copy of the macro with processed steps for the save modal
    const macroToSave: Macro = this.currentMacro;

    this.isRecording = false;
    this.currentSessionId = null;
    this.recordingTabId = null;
    this.currentMacro = null;

    // Clear recording state from repository
    await this.recordingStateRepository.clear();

    // Emit event to show save recording modal in content script
    this.emitter.emit("SHOW_SAVE_RECORDING_MODAL", {
      macro: macroToSave,
    });
  }

  private async saveMacro(macro: Macro): Promise<void> {
    await this.macroRepository.save(macro);
    this.logger.info("Saved macro after recording stop", {
      id: macro.id,
      domain: macro.domain,
      steps: macro.steps.length,
    });
  }

  private async recordUserAction(data: UserActionEvent["data"]): Promise<void> {
    if (!this.isRecording) {
      this.logger.warn("No recording in progress. Ignoring user action.");
      return;
    }

    if (!this.currentMacro) {
      this.logger.warn("No current macro. Ignoring user action.");
      return;
    }

    this.logger.info(`Recording user "${data.step.type}" action`, {
      step: data.step,
    });

    const settings = await this.settingsRepository.get();

    this.currentMacro.steps = MacroUtils.optimizeSteps(
      [...this.currentMacro.steps, data.step],
      settings
    );
    this.currentMacro.updatedAt = Date.now();
    this.logger.info("Recorded action", { step: data.step });

    // Save updated macro to repository
    void this.recordingStateRepository.update({ macro: this.currentMacro });
  }

  private async handleSaveRecordingConfirmed(
    data: SaveRecordingConfirmedEvent["data"]
  ): Promise<void> {
    this.logger.info("Save recording confirmed", {
      macroId: data.macro.id,
      name: data.macro.name,
    });

    await this.saveMacro(data.macro);
  }

  private handleSaveRecordingCancelled(
    data: SaveRecordingCancelledEvent["data"]
  ): void {
    this.logger.info("Save recording cancelled", { sessionId: data.sessionId });
    // Recording is already cleared, nothing to do
  }
}
