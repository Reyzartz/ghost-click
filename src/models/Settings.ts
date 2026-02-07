import { ElementSelectorType } from "./MacroStep";

export interface Settings {
  defaultRetryCount: number;
  defaultRetryIntervalMs: number;
  defaultSelectorType: ElementSelectorType;
  minimumDelayMs: number;
}

export const DEFAULT_SETTINGS: Settings = {
  defaultRetryCount: 3,
  defaultRetryIntervalMs: 1000,
  defaultSelectorType: "xpath",
  minimumDelayMs: 200,
};
