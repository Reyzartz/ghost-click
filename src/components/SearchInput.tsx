import { forwardRef } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function ({ value, onChange, placeholder = "Search..." }, ref) {
    return (
      <div className="px-6 py-2 border-solid border-b border-slate-600">
        <input
          ref={ref}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 text-sm border border-solid border-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent placeholder:text-slate-400 text-slate-900"
        />
      </div>
    );
  }
);
