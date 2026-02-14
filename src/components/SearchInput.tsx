import { forwardRef } from "react";
import { Input } from "@/design-system";
import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function ({ value, onChange, placeholder = "Search...", onKeyDown }, ref) {
    return (
      <Input
        ref={ref}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        fullWidth
        autoFocus
        icon={Search}
      />
    );
  }
);
