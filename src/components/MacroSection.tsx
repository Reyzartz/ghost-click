import { Macro } from "@/models";
import { MacroCard } from "./MacroCard";

interface MacroSectionProps {
  title: string;
  macros: Macro[];
  loading: boolean;
  emptyMessage: string;
  onPlay: (macroId: string) => void;
  onEdit: (macroId: string) => void;
  onDelete: (macroId: string) => void;
}

export const MacroSection = ({
  title,
  macros,
  loading,
  emptyMessage,
  onPlay,
  onEdit,
  onDelete,
}: MacroSectionProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-700">
        {title}
      </h3>
      {!loading && macros.length === 0 && (
        <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-slate-600">
          {emptyMessage}
        </div>
      )}
      <ul className="space-y-2">
        {macros.map((macro) => (
          <MacroCard
            key={macro.id}
            macro={macro}
            onEdit={() => onEdit(macro.id)}
            onPlay={() => onPlay(macro.id)}
            onDelete={() => onDelete(macro.id)}
          />
        ))}
      </ul>
    </div>
  );
};
