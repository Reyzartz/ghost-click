import { useState, useRef, useEffect } from "react";

export interface DropdownItem {
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
}

interface DropdownProps {
  items: DropdownItem[];
  trigger: React.ReactNode;
}

const variantStyles = {
  default: "text-slate-900",
  danger: "text-red-600 hover:bg-red-50",
};

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
        <div className="absolute right-0 top-full mt-1 z-10 min-w-30 rounded border border-slate-200 bg-white shadow-lg">
          {items.map((item, index) => (
            <button
              key={index}
              className={`cursor-pointer w-full px-3 py-2 text-left text-sm hover:bg-slate-50 first:rounded-t last:rounded-b ${
                variantStyles[item.variant || "default"]
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleItemClick(item.onClick);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
