import { Macro } from "@/models";
import { Dropdown, DropdownItem } from "../design-system/Dropdown";
import { DisplayFavicon } from "./DisplayFavicon";
import { Text, Button, Card } from "@/design-system";
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
    <Card
      as="li"
      variant={isSelected ? "selected" : "default"}
      onClick={onPlay}
      autoScroll={isSelected}
      className="group"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex grow items-start gap-3 overflow-hidden">
          <DisplayFavicon name={macro.name} faviconUrl={macro.faviconUrl} />

          <div className="grow overflow-hidden">
            <Text className="line-clamp-1 font-medium">{macro.name}</Text>
            <div className="flex items-center gap-2">
              <Text variant="small" color="muted" className="shrink-0">
                {macro.steps.length} steps • {macro.domain}
              </Text>
            </div>
          </div>
        </div>

        <Dropdown
          items={dropdownItems}
          trigger={
            <Button
              icon={MoreVertical}
              variant="ghost"
              color="secondary"
              size="sm"
              className="-mr-1 opacity-0 group-hover:opacity-100"
            />
          }
        />
      </div>
    </Card>
  );
};
