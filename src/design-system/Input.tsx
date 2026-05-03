import { InputHTMLAttributes, forwardRef } from "react";
import { LucideIcon } from "lucide-react";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { Text } from "./Text";
import { Icon } from "./Icon";

export type InputSize = "sm" | "md" | "lg";

interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  size?: InputSize;
  icon?: LucideIcon;
}

const inputVariants = cva(
  "rounded text-text-secondary transition-all focus:ring-1 border focus:outline-none disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60  ring-inset",
  {
    variants: {
      size: {
        sm: "text-xs leading-3.5 py-1.5",
        md: "text-sm leading-4 py-2.5",
        lg: "text-base leading-4.5 py-3.5",
      },
      hasError: {
        true: "bg-error-bg  focus:ring-error border-error-border",
        false:
          "bg-surface focus:bg-surface-active  focus:ring-primary border-border",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
      hasIcon: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        size: "sm",
        hasIcon: false,
        className: "px-2.5",
      },
      {
        size: "md",
        hasIcon: false,
        className: "px-3.5",
      },
      {
        size: "lg",
        hasIcon: false,
        className: "px-4.5",
      },
      {
        size: "sm",
        hasIcon: true,
        className: "pl-8 pr-2.5",
      },
      {
        size: "md",
        hasIcon: true,
        className: "pl-9 pr-3.5",
      },
      {
        size: "lg",
        hasIcon: true,
        className: "pl-11 pr-4.5",
      },
    ],
    defaultVariants: {
      size: "md",
      hasError: false,
      fullWidth: true,
      hasIcon: false,
    },
  }
);

const iconSizes: Record<InputSize, "sm" | "md" | "lg"> = {
  sm: "sm",
  md: "sm",
  lg: "md",
};

const iconLeftPositionClasses: Record<InputSize, string> = {
  sm: "left-2.5",
  md: "left-3",
  lg: "left-4",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      fullWidth = true,
      size = "md",
      className,
      id,
      icon: IconComponent,
      ...props
    },
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

        <div className="relative">
          {IconComponent && (
            <Icon
              icon={IconComponent}
              size={iconSizes[size]}
              color="muted"
              className={clsx(
                "pointer-events-none absolute top-1/2 -translate-y-1/2",
                iconLeftPositionClasses[size]
              )}
            />
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              inputVariants({
                size,
                hasError: !!error,
                fullWidth,
                hasIcon: !!IconComponent,
              }),
              className
            )}
            {...props}
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

Input.displayName = "Input";
