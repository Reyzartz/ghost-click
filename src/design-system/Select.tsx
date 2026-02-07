import { SelectHTMLAttributes, forwardRef } from "react";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { Text } from "./Text";

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
  "rounded border border-solid bg-white text-slate-700 transition-colors focus:border-slate-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 cursor-pointer",
  {
    variants: {
      size: {
        sm: "text-xs leading-3.5 px-3 py-1.5",
        md: "text-sm leading-4 px-4 py-2",
        lg: "text-base leading-4.5 px-6 py-3",
      },
      hasError: {
        true: "border-red-300 focus:border-red-500",
        false: "border-slate-300",
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
