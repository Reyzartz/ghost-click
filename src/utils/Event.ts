import { Macro, MacroStep } from "@/models";

export type EventType =
  | "START_RECORDING"
  | "STOP_RECORDING"
  | "USER_ACTION"
  | "SAVED_MACRO"
  | "PLAY_MACRO"
  | "EXECUTE_ACTION"
  | "PLAYBACK_COMPLETED"
  | "PLAYBACK_ERROR";

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

export type UserEventType = "CLICK";

export type UserEventTarget = {
  id: string;
  className: string;
  xpath: string;
};

interface BaseUserEventData {
  sessionId: string;
  timestamp: number;
  type: UserEventType;
}

export interface UserClickEventData extends BaseUserEventData {
  type: "CLICK";
  target: UserEventTarget;
}

export interface UserActionEvent extends BaseEvent {
  name: "USER_ACTION";
  data: UserClickEventData;
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
    error: any;
  };
}

export interface ExecuteActionEvent extends BaseEvent {
  name: "EXECUTE_ACTION";
  data: {
    step: MacroStep;
  };
}
