import { Macro } from "@/models";
import { MacroCard } from "./MacroCard";
import { Text } from "@/design-system";

interface MacroSectionProps {
  title: string;
  macros: Macro[];
  loading: boolean;
  emptyComponent?: React.ReactNode;
  onPlay: (macroId: string) => void;
  onEdit: (macroId: string) => void;
  onDelete: (macroId: string) => void;
  onCopy: (macroId: string) => void;
  onDuplicate: (macroId: string) => void;
  onPin: (macroId: string, value: boolean) => void;
  onRecord?: () => void;
  selectedIndex?: number;
}

export const MacroSection = ({
  title,
  macros,
  loading,
  emptyComponent,
  onPlay,
  onEdit,
  onDelete,
  onCopy,
  onDuplicate,
  onPin,
  selectedIndex,
}: MacroSectionProps) => {
  return (
    <div className="h-full space-y-2">
      {!loading && macros.length === 0 && emptyComponent}

      {!loading && macros.length > 0 && (
        <div className="flex items-end justify-between">
          <Text variant="h5" className="tracking-wide uppercase">
            {title}
          </Text>

          <Text variant="small" color="muted">
            {loading ? "Loading…" : `${macros.length} saved`}
          </Text>
        </div>
      )}

      {macros.length > 0 && (
        <ul className="flex flex-col gap-1">
          {macros.map((macro, index) => (
            <MacroCard
              key={macro.id}
              macro={macro}
              onEdit={() => onEdit(macro.id)}
              onPlay={() => onPlay(macro.id)}
              onDelete={() => onDelete(macro.id)}
              onCopy={() => onCopy(macro.id)}
              onDuplicate={() => onDuplicate(macro.id)}
              onPin={() => onPin(macro.id, !macro.pinned)}
              isSelected={
                selectedIndex !== undefined && index === selectedIndex
              }
            />
          ))}
        </ul>
      )}
    </div>
  );
};
