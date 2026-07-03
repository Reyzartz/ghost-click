export type Theme = "system" | "light" | "dark";

export type StepFailureAction = "stop" | "pause" | "continue";

export interface Settings {
  defaultRetryCount: number;
  defaultRetryIntervalMs: number;
  minimumDelayMs: number;
  theme: Theme;
  onStepFailure: StepFailureAction;
  refreshPageOnRecording: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  defaultRetryCount: 3,
  defaultRetryIntervalMs: 1000,
  minimumDelayMs: 200,
  theme: "system",
  onStepFailure: "stop",
  refreshPageOnRecording: true,
};
