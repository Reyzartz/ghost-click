import { Macro } from "@/models";
import { clsx } from "clsx";
import { Dropdown, DropdownItem } from "../design-system/Dropdown";
import { DisplayFavicon } from "./DisplayFavicon";
import { Text, Button } from "@/design-system";
import { MoreVertical, Play, Edit, Trash2, Copy, CopyPlus } from "lucide-react";

interface MacroCardProps {
  macro: Macro;
  onPlay: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCopy: () => void;
  onDuplicate: () => void;
  isSelected?: boolean;
}

export const MacroCard = ({
  macro,
  onPlay,
  onEdit,
  onDelete,
  onCopy,
  onDuplicate,
  isSelected = false,
}: MacroCardProps) => {
  const dropdownItems: DropdownItem[] = [
    {
      label: "Play",
      onClick: onPlay,
      icon: Play,
    },
    {
      label: "Edit",
      onClick: onEdit,
      icon: Edit,
    },
    {
      label: "Copy",
      onClick: onCopy,
      icon: Copy,
    },
    {
      label: "Duplicate",
      onClick: onDuplicate,
      icon: CopyPlus,
    },
    {
      label: "Delete",
      onClick: onDelete,
      variant: "danger" as const,
      icon: Trash2,
    },
  ];

  return (
    <li
      className={clsx(
        "group cursor-pointer rounded border p-2 transition-colors",
        isSelected
          ? "border-slate-300 bg-slate-100"
          : "border-slate-200 hover:bg-slate-100"
      )}
      onClick={onPlay}
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
        <div className="flex grow items-start gap-3 overflow-hidden">
          <DisplayFavicon
            name={macro.name}
            faviconUrl={macro.faviconUrl}
            className={clsx(
              "mt-0.5 transition-colors",
              isSelected ? "bg-white" : "group-hover:bg-white"
            )}
          />

          <div className="grow overflow-hidden">
            <Text className="line-clamp-1 font-medium">{macro.name}</Text>
            <div className="flex items-center gap-2">
              <Text variant="small" color="muted" className="shrink-0">
                {macro.steps.length} step
                {macro.steps.length === 1 ? "" : "s"}
              </Text>

              {macro.domain && (
                <Text variant="small" className="truncate text-slate-400">
                  • {macro.domain}
                </Text>
              )}
            </div>
          </div>
        </div>

        <Dropdown
          items={dropdownItems}
          trigger={
            <Button
              icon={MoreVertical}
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100"
            />
          }
        />
      </div>
    </li>
  );
};
