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
  iconFilled?: boolean;
  iconPosition?: "left" | "right";
}

const buttonVariants = cva(
  "cursor-pointer rounded font-medium transition-all inline-flex items-center justify-center gap-1.5 whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60 border",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-text-inverse hover:bg-primary-hover active:scale-[0.98] disabled:bg-primary border-primary disabled:border-primary",
        secondary:
          "bg-surface text-text-secondary hover:bg-surface-hover active:bg-surface-active",
        danger:
          "bg-error text-text-inverse hover:bg-error-hover active:scale-[0.98] border-error disabled:border-error",
        ghost:
          "bg-transparent text-text-secondary hover:bg-surface-hover border-transparent",

        success:
          "bg-success text-text-inverse hover:bg-success-hover active:scale-[0.98] border-success disabled:border-success",
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
        className: "p-2.5",
      },
      {
        size: "lg",
        iconOnly: true,
        className: "p-3.5",
      },
      {
        size: "sm",
        iconOnly: false,
        className: "px-2.5 py-1.5",
      },
      {
        size: "md",
        iconOnly: false,
        className: "px-3 py-2.5",
      },
      {
        size: "lg",
        iconOnly: false,
        className: "px-4 py-3.5",
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
