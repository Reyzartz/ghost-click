import { ButtonHTMLAttributes, forwardRef } from "react";
import { LucideIcon } from "lucide-react";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";

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

const buttonVariants = cva(
  "cursor-pointer rounded font-medium transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap border border-solid disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-text-inverse hover:bg-primary-hover disabled:bg-text-disabled border-primary",
        secondary:
          "bg-surface border-border-secondary text-text-secondary hover:bg-surface-muted",
        danger:
          "bg-error-bg text-error-text hover:bg-error-bg-hover disabled:bg-error-bg border-error-border",
        ghost:
          "bg-transparent text-text-secondary hover:bg-surface-hover border-transparent",
        success:
          "bg-success-bg text-success-text hover:bg-success-bg-hover border-success-border",
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
      {
        size: "sm",
        iconOnly: true,
        className: "p-1.5",
      },
      {
        size: "md",
        iconOnly: true,
        className: "p-2",
      },
      {
        size: "lg",
        iconOnly: true,
        className: "p-3",
      },
      {
        size: "sm",
        iconOnly: false,
        className: "px-3 py-1.5",
      },
      {
        size: "md",
        iconOnly: false,
        className: "px-4 py-2",
      },
      {
        size: "lg",
        iconOnly: false,
        className: "px-6 py-3",
      },
    ],
    defaultVariants: {
      variant: "primary",
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
      variant = "primary",
      size = "md",
      fullWidth = false,
      icon: IconComponent,
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
        size,
        fullWidth,
        iconOnly: IconComponent && !children,
      }),
      className
    );

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
