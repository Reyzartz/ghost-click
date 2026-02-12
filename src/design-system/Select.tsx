import { SelectHTMLAttributes, forwardRef } from "react";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { Text } from "./Text";
import { ChevronDownIcon } from "lucide-react";

export type SelectSize = "sm" | "md" | "lg";

interface SelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "size"
> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  size?: SelectSize;
}

const selectVariants = cva(
  "appearance-none rounded border border-solid text-text-secondary transition-colors focus:outline-none disabled:cursor-not-allowed disabled:bg-surface-muted cursor-pointer",
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

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      fullWidth = true,
      size = "md",
      className,
      id,
      children,
      ...props
    },
    ref
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={clsx("relative", fullWidth && "w-full")}>
        {label && (
          <Text variant="small" color="muted" className="mb-1 block">
            {label}
          </Text>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={clsx(
              selectVariants({
                size,
                hasError: !!error,
                fullWidth,
              }),
              className
            )}
            {...props}
          >
            {children}
          </select>

          <ChevronDownIcon
            width={16}
            className="text-text-secondary\ pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
          />
        </div>

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
