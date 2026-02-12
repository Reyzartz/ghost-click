import { Macro } from "@/models";
import { clsx } from "clsx";
import { Play } from "lucide-react";
import { Text } from "@/design-system";
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
    <li
      className={clsx(
        "group cursor-pointer rounded-lg border border-solid px-3 py-2 transition-colors",
        isSelected
          ? "border-border bg-surface-hover"
          : "hover:bg-surface-muted border-transparent"
      )}
      onClick={onSelect}
      ref={(el) => {
        if (isSelected && el) {
          el.scrollIntoView({
            block: "nearest",
            behavior: "smooth",
          });
        }
      }}
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

        {isSelected && <Play size={16} className="text-text-disabled" />}
      </div>
    </li>
  );
};

export { QuickActionItem };
