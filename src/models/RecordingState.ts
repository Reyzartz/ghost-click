import { MacroStep } from "./MacroStep";

export interface RecordingState {
  isRecording: boolean;
  sessionId: string | null;
  initialUrl: string;
  macroSteps: MacroStep[];
}
