import { SelectHTMLAttributes, forwardRef } from "react";
import { InfoPopover } from "@/design-system/InfoPopover";
import { LucideIcon } from "lucide-react";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { Text } from "./Text";
import { Icon } from "./Icon";
import { ChevronDownIcon } from "lucide-react";

export type SelectSize = "sm" | "md" | "lg";

interface SelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "size"
> {
  label?: string;
  info?: string;
  error?: string;
  fullWidth?: boolean;
  size?: SelectSize;
  icon?: LucideIcon;
}

const selectVariants = cva(
  "appearance-none rounded text-text-secondary transition-all focus:outline-none disabled:cursor-not-allowed border disabled:bg-surface-muted disabled:opacity-60 cursor-pointer",
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
          "bg-surface focus:bg-surface-active focus:border-primary border-border",
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
        className: "pl-2.5 pr-8",
      },
      {
        size: "md",
        hasIcon: false,
        className: "pl-3.5 pr-9",
      },
      {
        size: "lg",
        hasIcon: false,
        className: "pl-4.5 pr-11",
      },
      {
        size: "sm",
        hasIcon: true,
        className: "pl-8 pr-8",
      },
      {
        size: "md",
        hasIcon: true,
        className: "pl-9 pr-9",
      },
      {
        size: "lg",
        hasIcon: true,
        className: "pl-11 pr-11",
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

const iconSizes: Record<SelectSize, "sm" | "md" | "lg"> = {
  sm: "sm",
  md: "sm",
  lg: "md",
};

const iconLeftPositionClasses: Record<SelectSize, string> = {
  sm: "left-2.5",
  md: "left-3",
  lg: "left-4",
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      info,
      error,
      fullWidth = true,
      size = "md",
      className,
      id,
      children,
      icon: IconComponent,
      ...props
    },
    ref
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={clsx("relative", fullWidth && "w-full")}>
        {(label || info) && (
          <div className="mb-1 flex items-center gap-1">
            {label && (
              <Text variant="small" color="muted">
                {label}
              </Text>
            )}
            {info && <InfoPopover content={info} />}
          </div>
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

          <select
            ref={ref}
            id={selectId}
            className={clsx(
              selectVariants({
                size,
                hasError: !!error,
                fullWidth,
                hasIcon: !!IconComponent,
              }),
              className
            )}
            {...props}
          >
            {children}
          </select>

          <Icon
            icon={ChevronDownIcon}
            size="sm"
            color="muted"
            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
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
