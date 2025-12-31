import { MacroStep } from "./MacroStep";

export interface ClickTarget {
  id: string;
  className: string;
  xpath: string;
}

export interface ClickStep extends MacroStep {
  type: "CLICK";
  target: ClickTarget;
}
