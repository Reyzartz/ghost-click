import { Macro } from "@/models";

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
          <p
            className={`font-medium truncate ${
              isSelected ? "text-white" : "text-slate-900"
            }`}
          >
            {macro.name}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-xs ${
                isSelected ? "text-slate-300" : "text-slate-500"
              }`}
            >
              {macro.steps.length} step
              {macro.steps.length === 1 ? "" : "s"}
            </span>
            {macro.domain && (
              <>
                <span
                  className={`text-xs ${
                    isSelected ? "text-slate-400" : "text-slate-300"
                  }`}
                >
                  •
                </span>
                <span
                  className={`text-xs ${
                    isSelected ? "text-slate-300" : "text-slate-500"
                  }`}
                >
                  {macro.domain}
                </span>
              </>
            )}
          </div>
        </div>
        {isSelected && (
          <div className="ml-4">
            <span className="text-white text-lg">▶</span>
          </div>
        )}
      </div>
    </li>
  );
};

export { QuickActionItem };
