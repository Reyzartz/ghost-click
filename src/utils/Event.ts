export type EventType = "START_RECORDING" | "STOP_RECORDING";

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
