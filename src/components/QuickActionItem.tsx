import { Macro } from "@/models";
import { clsx } from "clsx";
import { Play } from "lucide-react";
import { Text, Icon, Card } from "@/design-system";
import { DisplayFavicon } from "./DisplayFavicon";

interface QuickActionItemProps {
  macro: Macro;
  isSelected: boolean;
  onSelect: () => void;
}

const QuickActionItem = ({
  macro,
  isSelected,
  onSelect,
}: QuickActionItemProps) => {
  return (
    <Card
      as="li"
      variant={isSelected ? "selected" : "default"}
      size="md"
      onClick={onSelect}
      autoScroll={isSelected}
      className={clsx(
        "group",
        !isSelected && "hover:bg-surface-muted border-transparent"
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex grow items-center gap-3 overflow-hidden">
          <DisplayFavicon
            name={macro.name}
            faviconUrl={macro.faviconUrl}
            className={clsx(isSelected && "bg-surface")}
          />

          <div className="grow overflow-hidden">
            <Text className="font-medium">{macro.name}</Text>
            <div className="flex items-center gap-2">
              <Text variant="small" color="muted" className="shrink-0">
                {macro.steps.length} step
                {macro.steps.length === 1 ? "" : "s"}
              </Text>

              {macro.domain && (
                <Text variant="small" className="text-text-subtle truncate">
                  • {macro.domain}
                </Text>
              )}
            </div>
          </div>
        </div>

        {isSelected && <Icon icon={Play} size="sm" color="muted" />}
      </div>
    </Card>
  );
};

export { QuickActionItem };
