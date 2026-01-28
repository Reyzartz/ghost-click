import { Macro, MacroStep, TargetElementSelector } from "@/models";

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
  | "TOGGLE_QUICK_ACTIONS"
  | "START_ELEMENT_INSPECTION"
  | "STOP_ELEMENT_INSPECTION"
  | "ELEMENT_SELECTED"
  | "SHOW_SAVE_RECORDING_MODAL"
  | "SAVE_RECORDING_CONFIRMED"
  | "SAVE_RECORDING_CANCELLED"
  | "RE_RECORD_REQUESTED"
  | "OPEN_IMPORT_MACRO_MODAL"
  | "EDIT_MACRO"
  | "CREATE_MACRO";

export interface BaseEvent {
  name: EventType;
  data?: object;
}

export interface StartRecordingEvent extends BaseEvent {
  name: "START_RECORDING";
  data: {
    sessionId: string;
    initialUrl: string;
    tabId: number;
  };
}

export interface StopRecordingEvent extends BaseEvent {
  name: "STOP_RECORDING";
}

export type UserEventType = "CLICK" | "INPUT" | "KEYPRESS";

interface BaseUserEventData {
  id: string;
  name: string;
  sessionId: string;
  timestamp: number;
  type: UserEventType;
}

export interface UserClickEventData extends BaseUserEventData {
  type: "CLICK";
  target: TargetElementSelector;
}

export interface UserInputEventData extends BaseUserEventData {
  type: "INPUT";
  target: TargetElementSelector;
  value: string;
}

export interface UserKeyPressEventData extends BaseUserEventData {
  type: "KEYPRESS";
  target: TargetElementSelector;
  key: string;
  code: string;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
}

export interface UserActionEvent extends BaseEvent {
  name: "USER_ACTION";
  data: UserClickEventData | UserInputEventData | UserKeyPressEventData;
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
    error: any;
  };
}

export interface ExecuteActionEvent extends BaseEvent {
  name: "EXECUTE_ACTION";
  data: {
    step: MacroStep;
  };
}

export interface ToggleQuickActionsEvent extends BaseEvent {
  name: "TOGGLE_QUICK_ACTIONS";
}

export interface ShowSaveRecordingModalEvent extends BaseEvent {
  name: "SHOW_SAVE_RECORDING_MODAL";
  data: {
    sessionId: string;
    initialUrl: string;
    steps: MacroStep[];
  };
}

export interface SaveRecordingConfirmedEvent extends BaseEvent {
  name: "SAVE_RECORDING_CONFIRMED";
  data: {
    sessionId: string;
    name: string;
    initialUrl: string;
    steps: MacroStep[];
  };
}

export interface SaveRecordingCancelledEvent extends BaseEvent {
  name: "SAVE_RECORDING_CANCELLED";
  data: {
    sessionId: string;
  };
}

export interface ReRecordRequestedEvent extends BaseEvent {
  name: "RE_RECORD_REQUESTED";
  data: {
    sessionId: string;
    initialUrl: string;
  };
}

export interface OpenImportMacroModalEvent extends BaseEvent {
  name: "OPEN_IMPORT_MACRO_MODAL";
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
  | ToggleQuickActionsEvent
  | ShowSaveRecordingModalEvent
  | SaveRecordingConfirmedEvent
  | SaveRecordingCancelledEvent
  | ReRecordRequestedEvent
  | OpenImportMacroModalEvent
  | PlayMacroPreviewEvent
  | CreateMacroEvent
  | EditMacroEvent
  | StartElementInspectionEvent
  | StopElementInspectionEvent
  | ElementSelectedEvent;
