import { LucideIcon } from "lucide-react";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";

const iconVariants = cva("shrink-0", {
  variants: {
    size: {
      xs: "h-3 w-3",
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
      xl: "h-8 w-8",
    },
    color: {
      default: "text-text",
      muted: "text-text-muted",
      success: "text-success-icon",
      error: "text-error-icon",
      warning: "text-warning-icon",
      info: "text-info-icon",
    },
  },
  defaultVariants: {
    size: "md",
    color: "default",
  },
});

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";
export type IconColor =
  | "default"
  | "muted"
  | "success"
  | "error"
  | "warning"
  | "info";

interface IconProps {
  icon: LucideIcon;
  size?: IconSize;
  color?: IconColor;
  className?: string;
}

export const Icon = ({
  icon: LucideIconComponent,
  size = "md",
  color = "default",
  className,
}: IconProps) => {
  const classes = clsx(iconVariants({ size, color }), className);
  return <LucideIconComponent className={classes} />;
};
