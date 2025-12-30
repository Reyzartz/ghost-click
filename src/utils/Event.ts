export type EventType = "START_RECORDING";

export const EventTypes: Record<EventType, EventType> = {
  START_RECORDING: "START_RECORDING",
};

interface Event {
  name: EventType;
  data?: any;
}

export interface StartRecordingEvent extends Event {
  name: "START_RECORDING";
  data: {
    sessionId: string;
  };
}
