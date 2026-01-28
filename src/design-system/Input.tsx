import { InputHTMLAttributes, forwardRef } from "react";
import { Text } from "./Text";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = true, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <Text variant="small" color="muted" className="mb-1 block">
            {label}
          </Text>
        )}

        <input
          ref={ref}
          id={inputId}
          className={[
            "rounded border border-solid bg-white px-3 py-2 text-sm text-slate-700 transition-colors",
            "focus:border-slate-500 focus:outline-none",
            "disabled:cursor-not-allowed disabled:bg-slate-50",
            error ? "border-red-300 focus:border-red-500" : "border-slate-300",
            fullWidth ? "w-full" : "",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
        {error && (
          <Text variant="small" color="error" className="mt-1">
            {error}
          </Text>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
