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
      <div className="px-6 py-2 border-solid border-b border-slate-600">
        <Input
          ref={ref}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="px-4 py-2 rounded-lg focus:ring-2 focus:ring-slate-900 placeholder:text-slate-400"
        />
      </div>
    );
  }
);
