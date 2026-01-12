import { Macro } from "@/models";
import { Dropdown } from "./Dropdown";

interface MacroCardProps {
  macro: Macro;
  onPlay: (macroId: string) => void;
  onDelete: (macroId: string) => void;
}

export const MacroCard = ({ macro, onPlay, onDelete }: MacroCardProps) => {
  return (
    <li className="rounded group border border-slate-200 px-3 py-2 hover:border-slate-300">
      <div className="flex items-center justify-between gap-4">
        <div className="grow overflow-hidden">
          <p className="font-medium text-slate-900">{macro.name}</p>
          <div className="flex gap-2 items-center">
            <span className="text-xs text-slate-600 flex-shrink-0">
              {macro.steps.length} step
              {macro.steps.length === 1 ? "" : "s"}
            </span>
            {macro.domain && (
              <span className="text-xs text-slate-400 truncate">
                • {macro.domain}
              </span>
            )}
          </div>
        </div>

        <Dropdown
          items={[
            {
              label: "Play",
              onClick: () => onPlay(macro.id),
            },
            {
              label: "Delete",
              onClick: () => onDelete(macro.id),
              variant: "danger",
            },
          ]}
          trigger={
            <button className="cursor-pointer opacity-0 group-hover:opacity-100 rounded bg-slate-100 px-2 py-2 text-xs text-slate-700 hover:bg-slate-200">
              •••
            </button>
          }
        />
      </div>
    </li>
  );
};
