import { Macro } from "@/models";
import { Play } from "lucide-react";
import { Text } from "@/design-system";

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
      className={`px-6 py-4 cursor-pointer transition-colors ${
        isSelected
          ? "bg-slate-900 text-white"
          : "bg-white hover:bg-slate-50 text-slate-900"
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
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <Text
            variant="body"
            className={`font-medium truncate ${
              isSelected ? "text-white" : "text-slate-900"
            }`}
          >
            {macro.name}
          </Text>
          <div className="flex items-center gap-2 mt-1">
            <Text
              variant="small"
              className={isSelected ? "text-slate-300" : "text-slate-500"}
            >
              {macro.steps.length} step
              {macro.steps.length === 1 ? "" : "s"}
            </Text>
            {macro.domain && (
              <>
                <Text
                  variant="small"
                  className={isSelected ? "text-slate-400" : "text-slate-300"}
                >
                  •
                </Text>
                <Text
                  variant="small"
                  className={isSelected ? "text-slate-300" : "text-slate-500"}
                >
                  {macro.domain}
                </Text>
              </>
            )}
          </div>
        </div>
        {isSelected && (
          <div className="ml-4">
            <Play size={18} className="text-white" />
          </div>
        )}
      </div>
    </li>
  );
};

export { QuickActionItem };
