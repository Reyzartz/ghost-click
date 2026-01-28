import { TextareaHTMLAttributes, forwardRef } from "react";
import { Text } from "./Text";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string | null;
  fullWidth?: boolean;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      fullWidth = true,
      className = "",
      containerClassName = "",
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={`${fullWidth ? "w-full" : ""} ${containerClassName}`}>
        {label && (
          <Text variant="small" color="muted" className="mb-1 block">
            {label}
          </Text>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          className={[
            "resize-none rounded border border-solid bg-white px-3 py-2 text-sm text-slate-700 transition-colors",
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
        {error && typeof error === "string" && (
          <Text variant="small" color="error" className="mt-1">
            {error}
          </Text>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
