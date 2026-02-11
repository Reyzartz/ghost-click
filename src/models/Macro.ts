import { MacroStep } from "./MacroStep";

export interface Macro {
  id: string;
  name: string;
  domain: string;
  faviconUrl: string | null;
  steps: MacroStep[];
  createdAt: number;
  updatedAt: number;
  lastPlayedAt: number | null;
  pinned: boolean;
}
