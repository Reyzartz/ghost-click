import { Macro } from "@/models";
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
      className={`group cursor-pointer px-3 py-2 border border-solid transition-colors rounded-lg ${
        isSelected
          ? "bg-slate-100 border-slate-200"
          : "hover:bg-slate-50 border-transparent"
      }`}
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
        <div className="flex items-center gap-3 grow overflow-hidden">
          <DisplayFavicon
            name={macro.name}
            faviconUrl={macro.faviconUrl}
            className={isSelected ? "bg-white" : ""}
          />

          <div className="grow overflow-hidden">
            <Text className="font-medium">{macro.name}</Text>
            <div className="flex gap-2 items-center">
              <Text variant="small" color="muted" className="shrink-0">
                {macro.steps.length} step
                {macro.steps.length === 1 ? "" : "s"}
              </Text>

              {macro.domain && (
                <Text variant="small" className="text-slate-400 truncate">
                  • {macro.domain}
                </Text>
              )}
            </div>
          </div>
        </div>

        {isSelected && <Play size={16} className="text-slate-300" />}
      </div>
    </li>
  );
};

export { QuickActionItem };
