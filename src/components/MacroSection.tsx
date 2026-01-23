import { Macro } from "@/models";
import { MacroCard } from "./MacroCard";
import { Text, Card } from "@/design-system";

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
      <div className="flex justify-between items-end">
        <Text variant="h5" className="uppercase tracking-wide">
          {title}
        </Text>

        <Text variant="small" color="muted">
          {loading ? "Loading…" : `${macros.length} saved`}
        </Text>
      </div>
      {!loading && macros.length === 0 && (
        <Card className="bg-slate-50 text-slate-600">{emptyMessage}</Card>
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
