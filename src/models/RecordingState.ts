import { Macro } from "./Macro";

export interface RecordingState {
  isRecording: boolean;
  sessionId: string | null;
  tabId: number | null;
  macro: Macro | null;
}
