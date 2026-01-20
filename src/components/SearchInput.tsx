import { forwardRef } from "react";
import { Input } from "@/design-system";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function ({ value, onChange, placeholder = "Search..." }, ref) {
    return (
      <Input
        ref={ref}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        fullWidth
        autoFocus
      />
    );
  }
);
