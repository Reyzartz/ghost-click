import { Macro } from "@/models";

interface MacroCardProps {
  macro: Macro;
  onPlay: (macroId: string) => void;
  onDelete: (macroId: string) => void;
}

export const MacroCard = ({ macro, onPlay, onDelete }: MacroCardProps) => {
  return (
    <li className="rounded border border-slate-200 px-3 py-2 hover:border-slate-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-slate-900">{macro.name}</p>
          <div className="flex gap-2 items-center">
            <span className="text-xs text-slate-600">
              {macro.steps.length} step
              {macro.steps.length === 1 ? "" : "s"}
            </span>
            {macro.domain && (
              <span className="text-xs text-slate-400">• {macro.domain}</span>
            )}
          </div>
        </div>

        <div className="flex items-end gap-2 flex-col">
          <button
            className="cursor-pointer rounded bg-slate-900 px-2 py-1 text-xs text-white hover:bg-slate-800"
            onClick={() => onPlay(macro.id)}
          >
            Play
          </button>
          <button
            className="cursor-pointer rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
            onClick={() => onDelete(macro.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
};
