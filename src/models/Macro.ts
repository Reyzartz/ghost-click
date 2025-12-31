import { MacroStep } from "./MacroStep";

export interface Macro {
  id: string;
  name: string;
  steps: MacroStep[];
  createdAt: number;
  updatedAt: number;
}
