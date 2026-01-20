import { ButtonHTMLAttributes, forwardRef } from "react";
import { LucideIcon } from "lucide-react";

export type IconButtonVariant = "default" | "ghost" | "danger";
export type IconButtonSize = "sm" | "md" | "lg";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  icon: LucideIcon;
}

const variantStyles: Record<IconButtonVariant, string> = {
  default: "bg-slate-100 text-slate-700 hover:bg-slate-200",
  ghost:
    "bg-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100",
  danger: "bg-red-100 text-red-700 hover:bg-red-200",
};

const sizeStyles: Record<IconButtonSize, string> = {
  sm: "p-1",
  md: "p-2",
  lg: "p-3",
};

const iconSizes: Record<IconButtonSize, number> = {
  sm: 14,
  md: 16,
  lg: 18,
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      variant = "default",
      size = "md",
      icon: IconComponent,
      className = "",
      ...props
    },
    ref
  ) => {
    const classes = [
      "cursor-pointer rounded transition-colors inline-flex items-center justify-center",
      "disabled:cursor-not-allowed disabled:opacity-50",
      variantStyles[variant],
      sizeStyles[size],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button ref={ref} className={classes} {...props}>
        <IconComponent size={iconSizes[size]} />
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
