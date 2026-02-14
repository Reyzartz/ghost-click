import { useState, useRef, useEffect } from "react";
import { Text } from "./Text";
import { Icon } from "./Icon";
import { LucideIcon } from "lucide-react";

export interface DropdownItem {
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
  icon?: LucideIcon;
}

interface DropdownProps {
  items: DropdownItem[];
  trigger: React.ReactNode;
}

export const Dropdown = ({ items, trigger }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleItemClick = (onClick: () => void) => {
    onClick();
    setIsOpen(false);
  };

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        {trigger}
      </div>

      {isOpen && (
        <div className="bg-surface absolute top-full right-0 z-10 mt-1 min-w-30 rounded shadow-lg">
          {items.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <button
                key={index}
                className="hover:bg-surface-hover flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm first:rounded-t last:rounded-b"
                onClick={(e) => {
                  e.stopPropagation();
                  handleItemClick(item.onClick);
                }}
              >
                {IconComponent && (
                  <Icon
                    icon={IconComponent}
                    size="sm"
                    color={item.variant === "danger" ? "error" : "default"}
                  />
                )}
                <Text
                  variant="body"
                  color={item.variant === "danger" ? "error" : "default"}
                >
                  {item.label}
                </Text>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
