export type EventType = "START_RECORDING" | "STOP_RECORDING" | "USER_ACTION";

interface Event {
  name: EventType;
  data?: {};
}

export interface StartRecordingEvent extends Event {
  name: "START_RECORDING";
  data: {
    sessionId: string;
  };
}

export interface StopRecordingEvent extends Event {
  name: "STOP_RECORDING";
  data: never;
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

export interface UserClickEvent extends BaseUserEventData {
  type: "CLICK";
  target: UserEventTarget;
}

export interface UserActionEvent extends Event {
  name: "USER_ACTION";
  data: UserClickEvent;
}
