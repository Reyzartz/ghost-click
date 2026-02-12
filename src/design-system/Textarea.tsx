import { TextareaHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";
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
      className,
      containerClassName,
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={clsx(fullWidth && "w-full", containerClassName)}>
        {label && (
          <Text variant="small" color="muted" className="mb-1 block">
            {label}
          </Text>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          className={clsx(
            "bg-surface text-text-secondary resize-none rounded border border-solid px-3 py-2 text-sm transition-colors",
            "focus:border-border-focus focus:outline-none",
            "disabled:bg-surface-muted disabled:cursor-not-allowed",
            error
              ? "border-error-border focus:border-error"
              : "border-border-secondary",
            fullWidth && "w-full",
            className
          )}
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
