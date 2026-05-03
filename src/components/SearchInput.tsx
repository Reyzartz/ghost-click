import { forwardRef } from "react";
import { Input, Kbd, Text } from "@/design-system";
import { ArrowDown, ArrowUp, Search } from "lucide-react";
import clsx from "clsx";

interface SearchInputProps {
  visible: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  resultCount: number;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function (
    {
      visible,
      value,
      onChange,
      placeholder = "Search...",
      onKeyDown,
      resultCount,
    },
    ref
  ) {
    return (
      <div
        className={clsx(
          "flex flex-col gap-1.5 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out",
          visible ? "max-h-15 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <Input
          ref={ref}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={!visible}
          fullWidth
          icon={Search}
          // Keep the input visible when disabled to show the search query and instructions
          className="disabled:opacity-100"
        />

        {resultCount > 0 && (
          <Text
            variant="small"
            color="muted"
            className="flex items-center gap-0.5 truncate"
          >
            Use
            <Kbd icon={ArrowUp} size="sm" />
            <Kbd icon={ArrowDown} size="sm" />
            to navigate,
            <Kbd size="sm">Enter</Kbd>
            to play,
            <Kbd size="sm">Esc</Kbd>
            to clear
          </Text>
        )}
      </div>
    );
  }
);
