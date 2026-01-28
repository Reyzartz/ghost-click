import { useState, useRef, useEffect } from "react";
import { Text } from "./Text";
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
        <div className="absolute top-full right-0 z-10 mt-1 min-w-30 rounded border border-slate-200 bg-white shadow-lg">
          {items.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <button
                key={index}
                className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm first:rounded-t last:rounded-b hover:bg-slate-50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleItemClick(item.onClick);
                }}
              >
                {IconComponent && (
                  <IconComponent
                    size={14}
                    className={
                      item.variant === "danger"
                        ? "text-red-700"
                        : "text-slate-900"
                    }
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
