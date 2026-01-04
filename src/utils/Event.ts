import { Macro, MacroStep } from "@/models";

export type EventType =
  | "START_RECORDING"
  | "STOP_RECORDING"
  | "USER_ACTION"
  | "SAVED_MACRO"
  | "PLAY_MACRO"
  | "EXECUTE_ACTION"
  | "PLAYBACK_COMPLETED"
  | "PLAYBACK_ERROR"
  | "STOP_PLAYBACK"
  | "TOGGLE_QUICK_ACTIONS";

export interface BaseEvent {
  name: EventType;
  data?: {};
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

export type UserEventTarget = {
  id: string;
  className: string;
  xpath: string;
};

interface BaseUserEventData {
  id: string;
  name: string;
  sessionId: string;
  timestamp: number;
  type: UserEventType;
}

export interface UserClickEventData extends BaseUserEventData {
  type: "CLICK";
  target: UserEventTarget;
}

export interface UserInputEventData extends BaseUserEventData {
  type: "INPUT";
  target: UserEventTarget;
  value: string;
}

export interface UserKeyPressEventData extends BaseUserEventData {
  type: "KEYPRESS";
  target: UserEventTarget;
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
