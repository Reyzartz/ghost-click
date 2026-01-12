import { Macro } from "@/models";
import { Dropdown, DropdownItem } from "./Dropdown";

interface MacroCardProps {
  macro: Macro;
  onPlay: () => void;
  onEdit?: () => void;
  onDelete: () => void;
}

export const MacroCard = ({
  macro,
  onPlay,
  onEdit,
  onDelete,
}: MacroCardProps) => {
  const dropdownItems: DropdownItem[] = [
    {
      label: "Play",
      onClick: onPlay,
    },
  ];

  if (onEdit) {
    dropdownItems.push({
      label: "Edit",
      onClick: onEdit,
    });
  }

  dropdownItems.push({
    label: "Delete",
    onClick: onDelete,
    variant: "danger" as const,
  });

  return (
    <li
      className="rounded group border cursor-pointer border-slate-200 px-3 py-2 hover:border-slate-300"
      onClick={onPlay}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="grow overflow-hidden">
          <p className="font-medium text-slate-900">{macro.name}</p>
          <div className="flex gap-2 items-center">
            <span className="text-xs text-slate-600 shrink-0">
              {macro.steps.length} step
              {macro.steps.length === 1 ? "" : "s"}
            </span>
            {macro.domain && (
              <span className="text-xs text-slate-400 truncate">
                • {macro.domain}
              </span>
            )}
          </div>
        </div>

        <Dropdown
          items={dropdownItems}
          trigger={
            <button className="cursor-pointer opacity-0 group-hover:opacity-100 rounded bg-slate-100 px-1 py-1 text-xs text-slate-700 hover:bg-slate-200">
              •••
            </button>
          }
        />
      </div>
    </li>
  );
};
