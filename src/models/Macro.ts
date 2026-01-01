import { MacroStep } from "./MacroStep";

export interface Macro {
  id: string;
  name: string;
  initialUrl: string;
  domain: string;
  steps: MacroStep[];
  createdAt: number;
  updatedAt: number;
}
