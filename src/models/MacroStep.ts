export type StepType = "CLICK" | "INPUT" | "KEYPRESS";

export interface BaseMacroStep {
  id: string;
  name: string;
  type: StepType;
  timestamp: number;
  delay: number;
}

export interface TargetElementSelector {
  id: string;
  className: string;
  xpath: string;
}

export interface ClickStep extends BaseMacroStep {
  type: "CLICK";
  target: TargetElementSelector;
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

export type MacroStep = ClickStep | InputStep | KeyPressStep;
