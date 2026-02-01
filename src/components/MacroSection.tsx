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
  onCopy: (macroId: string) => void;
  onDuplicate: (macroId: string) => void;
  selectedIndex?: number;
}

export const MacroSection = ({
  title,
  macros,
  loading,
  emptyMessage,
  onPlay,
  onEdit,
  onDelete,
  onCopy,
  onDuplicate,
  selectedIndex,
}: MacroSectionProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between">
        <Text variant="h5" className="tracking-wide uppercase">
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
        {macros.map((macro, index) => (
          <MacroCard
            key={macro.id}
            macro={macro}
            onEdit={() => onEdit(macro.id)}
            onPlay={() => onPlay(macro.id)}
            onDelete={() => onDelete(macro.id)}
            onCopy={() => onCopy(macro.id)}
            onDuplicate={() => onDuplicate(macro.id)}
            isSelected={selectedIndex !== undefined && index === selectedIndex}
          />
        ))}
      </ul>
    </div>
  );
};
