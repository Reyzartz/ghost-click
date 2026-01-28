import { Macro } from "@/models";
import { Dropdown, DropdownItem } from "../design-system/Dropdown";
import { DisplayFavicon } from "./DisplayFavicon";
import { Text, IconButton } from "@/design-system";
import { MoreVertical, Play, Edit, Trash2, Copy } from "lucide-react";

interface MacroCardProps {
  macro: Macro;
  onPlay: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCopy: () => void;
  isSelected?: boolean;
}

export const MacroCard = ({
  macro,
  onPlay,
  onEdit,
  onDelete,
  onCopy,
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
    label: "Delete",
    onClick: onDelete,
    variant: "danger" as const,
    icon: Trash2,
  }
  ];


  return (
    <li
      className={`rounded group cursor-pointer border transition-colors p-2 ${
        isSelected
          ? "bg-slate-100 border-slate-300"
          : "hover:bg-slate-100 border-slate-200"
      }`}
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
        <div className="flex items-start gap-3 grow overflow-hidden">
          <DisplayFavicon
            name={macro.name}
            faviconUrl={macro.faviconUrl}
            className={`mt-0.5 transition-colors ${
              isSelected ? "bg-white" : "group-hover:bg-white"
            }`}
          />

          <div className="grow overflow-hidden">
            <Text className="font-medium line-clamp-1">{macro.name}</Text>
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

        <Dropdown
          items={dropdownItems}
          trigger={
            <IconButton
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
