import { MacroStep } from "@/models";

interface EditStepItemProps {
  step: MacroStep;
  index: number;
}

export const EditStepItem = ({ step, index }: EditStepItemProps) => {
  return (
    <li className="rounded px-3 py-2 text-xs bg-white border border-slate-200 mx-auto max-w-max list-none">
      <div className="flex items-center gap-2">
        <span className="text-slate-400">#{index + 1}</span>
        <span>{step.name}</span>
      </div>
    </li>
  );
};
