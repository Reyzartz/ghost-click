export type StepType = "CLICK";

export interface BaseMacroStep {
  type: StepType;
  timestamp: number;
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

export type MacroStep = ClickStep;
