import { ButtonHTMLAttributes, forwardRef } from "react";
import { LucideIcon } from "lucide-react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "ghost"
  | "success";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-300 border-slate-900",
  secondary: "bg-white border-slate-300 text-slate-700 hover:bg-slate-50",
  danger:
    "bg-red-50 text-red-700 hover:bg-red-100 disabled:bg-red-200 border-red-300",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100 border-transparent",
  success: "bg-green-50 text-green-700 hover:bg-green-100 border-green-200",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

const iconSizes: Record<ButtonSize, number> = {
  sm: 14,
  md: 16,
  lg: 18,
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      icon: IconComponent,
      iconPosition = "left",
      className = "",
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const classes = [
      "cursor-pointer rounded font-medium transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap border border-solid",
      "disabled:cursor-not-allowed",
      variantStyles[variant],
      sizeStyles[size],
      fullWidth ? "w-full" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button ref={ref} className={classes} disabled={disabled} {...props}>
        {IconComponent && iconPosition === "left" && (
          <IconComponent size={iconSizes[size]} />
        )}
        {children}
        {IconComponent && iconPosition === "right" && (
          <IconComponent size={iconSizes[size]} />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
