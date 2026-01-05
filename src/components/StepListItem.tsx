import { MacroStep } from "@/models";

interface StepListItemProps {
  step: MacroStep;
  index: number;
  isCurrent: boolean;
  isCompleted: boolean;
  isErrored: boolean;
}

export const StepListItem = ({
  step,
  index,
  isCurrent,
  isCompleted,
  isErrored,
}: StepListItemProps) => {
  return (
    <li
      className={`rounded px-3 py-2 text-xs ${
        isCurrent
          ? "bg-green-100 border border-green-300 font-medium"
          : isCompleted
          ? "bg-slate-100 border border-slate-200 text-slate-500 line-through"
          : "bg-white border border-slate-200"
      } ${isErrored ? "border-red-300 bg-red-50 text-red-700" : ""}`}
      autoFocus={isCurrent}
      ref={(el) => {
        if (isCurrent && el) {
          el.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-slate-400">#{index + 1}</span>
        <span>{step.name}</span>
        {isCurrent && <span className="ml-auto text-green-600">▶</span>}
        {isCompleted && !isErrored && (
          <span className="ml-auto text-green-600">✓</span>
        )}
        {isErrored && <span className="ml-auto text-red-600">!</span>}
      </div>
    </li>
  );
};
