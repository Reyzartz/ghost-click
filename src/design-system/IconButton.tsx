import { ButtonHTMLAttributes, forwardRef } from "react";

export type IconButtonVariant = "default" | "ghost" | "danger";
export type IconButtonSize = "sm" | "md" | "lg";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  icon: string;
}

const variantStyles: Record<IconButtonVariant, string> = {
  default: "bg-slate-100 text-slate-700 hover:bg-slate-200",
  ghost:
    "bg-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100",
  danger: "bg-red-100 text-red-700 hover:bg-red-200",
};

const sizeStyles: Record<IconButtonSize, string> = {
  sm: "px-1 py-1 text-xs",
  md: "px-2 py-2 text-sm",
  lg: "px-3 py-3 text-base",
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { variant = "default", size = "md", icon, className = "", ...props },
    ref
  ) => {
    const classes = [
      "cursor-pointer rounded transition-colors",
      "disabled:cursor-not-allowed disabled:opacity-50",
      variantStyles[variant],
      sizeStyles[size],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button ref={ref} className={classes} {...props}>
        {icon}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
