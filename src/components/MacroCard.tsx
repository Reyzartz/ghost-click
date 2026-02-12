import { Macro } from "@/models";
import { clsx } from "clsx";
import { Dropdown, DropdownItem } from "../design-system/Dropdown";
import { DisplayFavicon } from "./DisplayFavicon";
import { Text, Button } from "@/design-system";
import {
  MoreVertical,
  Play,
  Edit,
  Trash2,
  Copy,
  CopyPlus,
  Pin,
  PinOff,
} from "lucide-react";

interface MacroCardProps {
  macro: Macro;
  onPlay: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCopy: () => void;
  onDuplicate: () => void;
  onPin: () => void;
  isSelected?: boolean;
}

export const MacroCard = ({
  macro,
  onPlay,
  onEdit,
  onDelete,
  onCopy,
  onPin,
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
      label: macro.pinned ? "Unpin" : "Pin",
      onClick: onPin,
      icon: macro.pinned ? PinOff : Pin,
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
          ? "border-border-secondary bg-surface-hover"
          : "border-border hover:bg-surface-hover"
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
              isSelected ? "bg-surface" : "group-hover:bg-surface"
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
                <Text variant="small" className="text-text-subtle truncate">
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
