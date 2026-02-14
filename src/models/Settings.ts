import { ElementSelectorType } from "./MacroStep";

export type Theme = "system" | "light" | "dark";

export interface Settings {
  defaultRetryCount: number;
  defaultRetryIntervalMs: number;
  defaultSelectorType: ElementSelectorType;
  minimumDelayMs: number;
  theme: Theme;
  stopOnError: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  defaultRetryCount: 3,
  defaultRetryIntervalMs: 1000,
  defaultSelectorType: "xpath",
  minimumDelayMs: 200,
  theme: "system",
  stopOnError: false,
};
