import { HTMLAttributes } from "react";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";

const badgeVariants = cva(
  "inline-flex items-center px-1 py-0.5 rounded-sm text-[10px] font-medium border shrink-0",
  {
    variants: {
      variant: {
        default: "bg-slate-100 text-slate-700 border-slate-200",
        success: "bg-green-50 text-green-700 border-green-200",
        error: "bg-red-50 text-red-700 border-red-200",
        warning: "bg-amber-50 text-amber-700 border-amber-200",
        info: "bg-blue-50 text-blue-700 border-blue-200",
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
