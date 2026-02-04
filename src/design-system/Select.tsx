import { SelectHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";
import { Text } from "./Text";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, fullWidth = true, className, id, children, ...props },
    ref
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={clsx(fullWidth && "w-full")}>
        {label && (
          <Text variant="small" color="muted" className="mb-1 block">
            {label}
          </Text>
        )}

        <select
          ref={ref}
          id={selectId}
          className={clsx(
            "rounded border border-solid bg-white px-3 py-2 text-sm text-slate-700 transition-colors",
            "focus:border-slate-500 focus:outline-none",
            "disabled:cursor-not-allowed disabled:bg-slate-50",
            "cursor-pointer",
            error ? "border-red-300 focus:border-red-500" : "border-slate-300",
            fullWidth && "w-full",
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && (
          <Text variant="small" color="error" className="mt-1">
            {error}
          </Text>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
