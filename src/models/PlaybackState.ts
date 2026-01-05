export interface PlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  macroId: string | null;
  currentStepId: string | null;
}
