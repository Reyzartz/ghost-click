import { Macro } from "@/models";

export type EventType =
  | "START_RECORDING"
  | "STOP_RECORDING"
  | "USER_ACTION"
  | "SAVED_MACRO";

export interface BaseEvent {
  name: EventType;
  data?: {};
}

export interface StartRecordingEvent extends BaseEvent {
  name: "START_RECORDING";
  data: {
    sessionId: string;
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
