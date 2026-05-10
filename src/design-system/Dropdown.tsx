import { useState, useEffect } from "react";
import { usePopper } from "react-popper";
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
  const [referenceEl, setReferenceEl] = useState<HTMLDivElement | null>(null);
  const [popperEl, setPopperEl] = useState<HTMLDivElement | null>(null);

  const { styles, attributes } = usePopper(referenceEl, popperEl, {
    placement: "bottom-end",
    modifiers: [{ name: "offset", options: { offset: [0, 4] } }],
  });

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        referenceEl &&
        !referenceEl.contains(event.target as Node) &&
        popperEl &&
        !popperEl.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, referenceEl, popperEl]);

  const handleItemClick = (onClick: () => void) => {
    onClick();
    setIsOpen(false);
  };

  const handletriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("trigger clicked, toggling dropdown", isOpen);
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div
        ref={setReferenceEl}
        className="shrink-0"
        onClick={handletriggerClick}
      >
        {trigger}
      </div>

      <div
        ref={setPopperEl}
        style={styles.popper}
        {...attributes.popper}
        className={isOpen ? "z-50" : "pointer-events-none invisible"}
      >
        <div className="bg-surface min-w-30 rounded shadow-lg">
          {items.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <button
                key={index}
                className="hover:bg-surface-hover flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm whitespace-pre first:rounded-t last:rounded-b"
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
      </div>
    </>
  );
};
