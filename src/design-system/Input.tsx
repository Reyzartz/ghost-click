import { InputHTMLAttributes, forwardRef } from "react";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { Text } from "./Text";

export type InputSize = "sm" | "md" | "lg";

interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  size?: InputSize;
}

const inputVariants = cva(
  "rounded border border-solid text-text-secondary transition-colors focus:outline-none disabled:cursor-not-allowed disabled:bg-surface-muted",
  {
    variants: {
      size: {
        sm: "text-xs leading-3.5 px-3 py-1.5",
        md: "text-sm leading-4 px-4 py-2",
        lg: "text-base leading-4.5 px-6 py-3",
      },
      hasError: {
        true: "border-error-border focus:border-error bg-error-bg",
        false: "border-border-secondary bg-surface focus:border-border-focus",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      hasError: false,
      fullWidth: true,
    },
  }
);

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, fullWidth = true, size = "md", className, id, ...props },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={clsx(fullWidth && "w-full")}>
        {label && (
          <Text variant="small" color="muted" className="mb-1 block">
            {label}
          </Text>
        )}

        <input
          ref={ref}
          id={inputId}
          className={clsx(
            inputVariants({
              size,
              hasError: !!error,
              fullWidth,
            }),
            className
          )}
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
