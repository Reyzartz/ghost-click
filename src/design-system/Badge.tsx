import { HTMLAttributes } from "react";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";

const badgeVariants = cva(
  "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0",
  {
    variants: {
      variant: {
        default: "bg-surface-hover text-text-secondary",
        success: "bg-success-bg text-success-text",
        error: "bg-error-bg text-error-text",
        warning: "bg-warning-bg text-warning-text",
        info: "bg-info-bg text-info-text",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type BadgeVariant = "default" | "success" | "error" | "warning" | "info";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export const Badge = ({
  variant = "default",
  children,
  className,
  ...props
}: BadgeProps) => {
  const classes = clsx(badgeVariants({ variant }), className);

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};
