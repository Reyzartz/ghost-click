import { ButtonHTMLAttributes, forwardRef } from "react";
import { LucideIcon } from "lucide-react";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";

export type ButtonVariant = "filled" | "outlined" | "ghost" | "text";
export type ButtonColor = "primary" | "secondary" | "danger" | "success";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: LucideIcon;
  iconFilled?: boolean;
  iconPosition?: "left" | "right";
}

const buttonVariants = cva(
  "cursor-pointer rounded font-medium transition-all inline-flex items-center justify-center gap-1.5 whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60 border",
  {
    variants: {
      variant: {
        filled: "",
        outlined: "",
        ghost: "",
        text: "",
      },
      color: {
        primary: "",
        secondary: "",
        danger: "",
        success: "",
      },
      size: {
        sm: "text-xs leading-3.5",
        md: "text-sm leading-4",
        lg: "text-base leading-4.5",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
      iconOnly: {
        true: "aspect-square",
        false: "",
      },
    },
    compoundVariants: [
      // filled
      {
        variant: "filled",
        color: "primary",
        className:
          "bg-primary text-text-inverse hover:bg-primary-hover active:scale-[0.98] border-primary disabled:bg-primary disabled:border-primary",
      },
      {
        variant: "filled",
        color: "secondary",
        className:
          "bg-surface text-text-secondary hover:bg-surface-hover active:bg-surface-active border-transparent",
      },
      {
        variant: "filled",
        color: "danger",
        className:
          "bg-error text-text-inverse hover:bg-error-hover active:scale-[0.98] border-error disabled:border-error",
      },
      {
        variant: "filled",
        color: "success",
        className:
          "bg-success text-text-inverse hover:bg-success-hover active:scale-[0.98] border-success disabled:border-success",
      },
      // outlined
      {
        variant: "outlined",
        color: "primary",
        className:
          "bg-transparent text-primary border-primary hover:bg-primary/10 active:scale-[0.98]",
      },
      {
        variant: "outlined",
        color: "secondary",
        className:
          "bg-transparent text-text-secondary border-border hover:bg-surface-hover",
      },
      {
        variant: "outlined",
        color: "danger",
        className:
          "bg-transparent text-error border-error hover:bg-error/10 active:scale-[0.98]",
      },
      {
        variant: "outlined",
        color: "success",
        className:
          "bg-transparent text-success border-success hover:bg-success/10 active:scale-[0.98]",
      },
      // ghost
      {
        variant: "ghost",
        color: "primary",
        className:
          "bg-transparent text-primary border-transparent hover:bg-primary/10",
      },
      {
        variant: "ghost",
        color: "secondary",
        className:
          "bg-transparent text-text-secondary border-transparent hover:bg-surface-hover",
      },
      {
        variant: "ghost",
        color: "danger",
        className:
          "bg-transparent text-error border-transparent hover:bg-error/10",
      },
      {
        variant: "ghost",
        color: "success",
        className:
          "bg-transparent text-success border-transparent hover:bg-success/10",
      },
      // text
      {
        variant: "text",
        color: "primary",
        className:
          "bg-transparent text-primary border-transparent hover:underline",
      },
      {
        variant: "text",
        color: "secondary",
        className:
          "bg-transparent text-text-secondary border-transparent hover:underline",
      },
      {
        variant: "text",
        color: "danger",
        className:
          "bg-transparent text-error border-transparent hover:underline",
      },
      {
        variant: "text",
        color: "success",
        className:
          "bg-transparent text-success border-transparent hover:underline",
      },
      // size + iconOnly
      { size: "sm", iconOnly: true, className: "p-1.5" },
      { size: "md", iconOnly: true, className: "p-2.5" },
      { size: "lg", iconOnly: true, className: "p-3.5" },
      { size: "sm", iconOnly: false, className: "min-w-18 px-2.5 py-1.5" },
      { size: "md", iconOnly: false, className: "min-w-20 px-3 py-2.5" },
      { size: "lg", iconOnly: false, className: "min-w-22 px-4 py-3.5" },
    ],
    defaultVariants: {
      variant: "filled",
      color: "primary",
      size: "md",
      fullWidth: false,
      iconOnly: false,
    },
  }
);

const iconSizes: Record<ButtonSize, number> = {
  sm: 14,
  md: 16,
  lg: 18,
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "filled",
      color = "primary",
      size = "md",
      fullWidth = false,
      icon: IconComponent,
      iconFilled = false,
      iconPosition = "left",
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const classes = clsx(
      buttonVariants({
        variant,
        color,
        size,
        fullWidth,
        iconOnly: IconComponent && !children,
      }),
      className
    );

    return (
      <button ref={ref} className={classes} disabled={disabled} {...props}>
        {IconComponent && iconPosition === "left" && (
          <IconComponent
            size={iconSizes[size]}
            fill={iconFilled ? "currentColor" : "none"}
          />
        )}
        {children}
        {IconComponent && iconPosition === "right" && (
          <IconComponent
            size={iconSizes[size]}
            fill={iconFilled ? "currentColor" : "none"}
          />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
