import { Macro, MacroStep, TargetElementSelector, Settings } from "@/models";

export type EventType =
  | "START_RECORDING"
  | "STOP_RECORDING"
  | "USER_ACTION"
  | "SAVED_MACRO"
  | "PLAY_MACRO"
  | "PLAY_MACRO_PREVIEW"
  | "EXECUTE_ACTION"
  | "PLAYBACK_COMPLETED"
  | "PLAYBACK_ERROR"
  | "STOP_PLAYBACK"
  | "PAUSE_PLAYBACK"
  | "RESUME_PLAYBACK"
  | "START_ELEMENT_INSPECTION"
  | "STOP_ELEMENT_INSPECTION"
  | "ELEMENT_SELECTED"
  | "SHOW_SAVE_RECORDING_MODAL"
  | "SAVE_RECORDING_CONFIRMED"
  | "SAVE_RECORDING_CANCELLED"
  | "CANCEL_RECORDING"
  | "OPEN_IMPORT_MACRO_MODAL"
  | "OPEN_DUPLICATE_MACRO_MODAL"
  | "EDIT_MACRO"
  | "CREATE_MACRO"
  | "OPEN_SIDE_PANEL"
  | "SETTINGS_UPDATED"
  | "TAB_UPDATED"
  | "TAB_REMOVED"
  | "TAB_ACTIVATED"
  | "TAB_CREATED";

export interface BaseEvent {
  name: EventType;
  data?: object;
}

export interface StartRecordingEvent extends BaseEvent {
  name: "START_RECORDING";
  data: {
    sessionId: string;
    domain: string;
    tabId?: number;
  };
}

export interface StopRecordingEvent extends BaseEvent {
  name: "STOP_RECORDING";
}

export interface UserActionEvent extends BaseEvent {
  name: "USER_ACTION";
  data: {
    sessionId: string;
    step: MacroStep;
  };
}

export interface SavedMacroEvent extends BaseEvent {
  name: "SAVED_MACRO";
  data: Macro;
}

export interface PlayMacroEvent extends BaseEvent {
  name: "PLAY_MACRO";
  data: {
    macroId: string;
  };
}

export interface StopPlaybackEvent extends BaseEvent {
  name: "STOP_PLAYBACK";
}

export interface PausePlaybackEvent extends BaseEvent {
  name: "PAUSE_PLAYBACK";
}

export interface ResumePlaybackEvent extends BaseEvent {
  name: "RESUME_PLAYBACK";
}

export interface PlaybackCompletedEvent extends BaseEvent {
  name: "PLAYBACK_COMPLETED";
  data: {
    macroId: string;
  };
}

export interface PlaybackErrorEvent extends BaseEvent {
  name: "PLAYBACK_ERROR";
  data: {
    macroId: string;
    stepId: string | null;
    error: string;
  };
}

export interface ExecuteActionEvent extends BaseEvent {
  name: "EXECUTE_ACTION";
  data: {
    step: MacroStep;
  };
}

export interface ShowSaveRecordingModalEvent extends BaseEvent {
  name: "SHOW_SAVE_RECORDING_MODAL";
  data: {
    macro: Macro;
  };
}

export interface SaveRecordingConfirmedEvent extends BaseEvent {
  name: "SAVE_RECORDING_CONFIRMED";
  data: {
    macro: Macro;
  };
}

export interface SaveRecordingCancelledEvent extends BaseEvent {
  name: "SAVE_RECORDING_CANCELLED";
  data: {
    sessionId: string;
  };
}

export interface CancelRecordingEvent extends BaseEvent {
  name: "CANCEL_RECORDING";
}

export interface OpenImportMacroModalEvent extends BaseEvent {
  name: "OPEN_IMPORT_MACRO_MODAL";
}

export interface OpenDuplicateMacroModalEvent extends BaseEvent {
  name: "OPEN_DUPLICATE_MACRO_MODAL";
  data: {
    macro: Macro;
  };
}

export interface PlayMacroPreviewEvent extends BaseEvent {
  name: "PLAY_MACRO_PREVIEW";
  data: {
    macro: Macro;
  };
}

export interface CreateMacroEvent extends BaseEvent {
  name: "CREATE_MACRO";
  data: {
    macro: Macro;
  };
}

export interface EditMacroEvent extends BaseEvent {
  name: "EDIT_MACRO";
  data: {
    macroId: string;
  };
}

export interface StartElementInspectionEvent extends BaseEvent {
  name: "START_ELEMENT_INSPECTION";
}

export interface StopElementInspectionEvent extends BaseEvent {
  name: "STOP_ELEMENT_INSPECTION";
}

export interface ElementSelectedEvent extends BaseEvent {
  name: "ELEMENT_SELECTED";
  data: {
    target: TargetElementSelector;
  };
}

export interface OpenSidePanel extends BaseEvent {
  name: "OPEN_SIDE_PANEL";
}

export interface SettingsUpdatedEvent extends BaseEvent {
  name: "SETTINGS_UPDATED";
  data: Settings;
}

export interface TabUpdatedEvent extends BaseEvent {
  name: "TAB_UPDATED";
  data: {
    tabId: number;
    changeInfo: chrome.tabs.OnUpdatedInfo;
    tab: chrome.tabs.Tab;
  };
}

export interface TabRemovedEvent extends BaseEvent {
  name: "TAB_REMOVED";
  data: {
    tabId: number;
    removeInfo: chrome.tabs.OnRemovedInfo;
  };
}

export interface TabActivatedEvent extends BaseEvent {
  name: "TAB_ACTIVATED";
  data: {
    activeInfo: chrome.tabs.OnActivatedInfo;
  };
}

export interface TabCreatedEvent extends BaseEvent {
  name: "TAB_CREATED";
  data: {
    tab: chrome.tabs.Tab;
  };
}

export type AppEvents =
  | StartRecordingEvent
  | StopRecordingEvent
  | UserActionEvent
  | SavedMacroEvent
  | PlayMacroEvent
  | StopPlaybackEvent
  | PausePlaybackEvent
  | ResumePlaybackEvent
  | PlaybackCompletedEvent
  | PlaybackErrorEvent
  | ExecuteActionEvent
  | ShowSaveRecordingModalEvent
  | SaveRecordingConfirmedEvent
  | SaveRecordingCancelledEvent
  | CancelRecordingEvent
  | OpenImportMacroModalEvent
  | OpenDuplicateMacroModalEvent
  | PlayMacroPreviewEvent
  | CreateMacroEvent
  | EditMacroEvent
  | StartElementInspectionEvent
  | StopElementInspectionEvent
  | ElementSelectedEvent
  | OpenSidePanel
  | SettingsUpdatedEvent
  | TabUpdatedEvent
  | TabRemovedEvent
  | TabActivatedEvent
  | TabCreatedEvent;
