export type StepType = "CLICK" | "INPUT" | "KEYPRESS" | "NAVIGATE" | "PAUSE";

export interface BaseMacroStep {
  id: string;
  name: string;
  type: StepType;
  timestamp: number;
  delay: number;
  retryCount: number;
  retryInterval: number;
}

export type ResolvableStepType = "CLICK" | "INPUT" | "KEYPRESS";

export interface TargetElementSelector {
  id: string;
  className: string;
  xpath: string;
  testId?: string;
  ariaLabel?: string;
  name?: string;
  text?: string;
}

export interface ClickStep extends BaseMacroStep {
  type: "CLICK";
  target: TargetElementSelector;
  clicksCount: number;
}

export interface InputStep extends BaseMacroStep {
  type: "INPUT";
  target: TargetElementSelector;
  value: string;
}

export interface KeyPressStep extends BaseMacroStep {
  type: "KEYPRESS";
  target: TargetElementSelector;
  key: string;
  code: string;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
}

export interface NavigateStep extends BaseMacroStep {
  type: "NAVIGATE";
  url: string;
}

export interface PauseStep extends BaseMacroStep {
  type: "PAUSE";
  message: string;
}

export type MacroStep =
  | ClickStep
  | InputStep
  | KeyPressStep
  | NavigateStep
  | PauseStep;
