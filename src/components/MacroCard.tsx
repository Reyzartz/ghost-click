import { Macro } from "@/models";
import { Dropdown, DropdownItem } from "../design-system/Dropdown";
import { DisplayFavicon } from "./DisplayFavicon";
import { Text, IconButton } from "@/design-system";
import { MoreVertical, Play, Edit, Trash2 } from "lucide-react";

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
      icon: Play,
    },
  ];

  if (onEdit) {
    dropdownItems.push({
      label: "Edit",
      onClick: onEdit,
      icon: Edit,
    });
  }

  dropdownItems.push({
    label: "Delete",
    onClick: onDelete,
    variant: "danger" as const,
    icon: Trash2,
  });

  return (
    <li
      className="rounded group border cursor-pointer border-slate-200 px-3 py-2 hover:border-slate-300"
      onClick={onPlay}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-3 grow overflow-hidden">
          <DisplayFavicon
            name={macro.name}
            faviconUrl={macro.faviconUrl}
            className="mt-1"
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
