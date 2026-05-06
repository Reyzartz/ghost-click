import { HTMLAttributes, ReactNode, forwardRef, ElementType } from "react";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";

export type CardVariant =
  | "default"
  | "selected"
  | "success"
  | "secondary"
  | "errored"
  | "deleted";

export type CardSize = "sm" | "md" | "lg";

interface CardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  hover?: boolean;
  clickable?: boolean;
  as?: ElementType;
  autoScroll?: boolean;
  disabled?: boolean;
}

const cardVariants = cva("rounded transition-colors list-none border", {
  variants: {
    variant: {
      default: "bg-surface",
      selected: "bg-surface-hover border-accent-hover",
      success: "bg-success-bg font-medium border-success-border",
      secondary: "bg-background-secondary text-text-muted",
      errored: "bg-error-bg text-error-text border-error-border",
      deleted: "bg-error-bg opacity-50 border-error-border",
    },
    size: {
      sm: "px-2 py-1.5",
      md: "px-3 py-2.5",
      lg: "p-4",
    },
    hover: {
      true: "",
      false: "",
    },
    clickable: {
      true: "cursor-pointer",
      false: "",
    },
    disabled: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    {
      hover: true,
      variant: "default",
      className: "hover:bg-surface-hover hover:border-border-hover",
    },
    {
      hover: true,
      variant: "selected",
      className: "hover:bg-surface-active",
    },
    {
      hover: true,
      variant: "secondary",
      className: "hover:bg-background-secondary-hover",
    },
    {
      disabled: true,
      clickable: true,
      className: "cursor-not-allowed",
    },
  ],
  defaultVariants: {
    variant: "default",
    size: "md",
    hover: false,
    clickable: false,
  },
});

export const Card = forwardRef<HTMLElement, CardProps>(
  (
    {
      children,
      variant = "default",
      size = "md",
      hover = false,
      clickable = false,
      as: Component = "div",
      autoScroll = false,
      disabled = false,
      onClick,
      className,
      ...props
    },
    ref
  ) => {
    const classes = clsx(
      cardVariants({
        variant,
        size,
        hover: hover || !!onClick,
        clickable: clickable || !!onClick,
        disabled,
      }),
      className
    );

    return (
      <Component
        ref={(el: HTMLElement | null) => {
          if (
            autoScroll &&
            el &&
            (variant === "success" || variant === "selected")
          ) {
            el.scrollIntoView({
              block: "nearest",
              behavior: "smooth",
            });
          }
          if (typeof ref === "function") {
            ref(el);
          } else if (ref) {
            ref.current = el;
          }
        }}
        className={classes}
        onClick={disabled ? undefined : onClick}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = "Card";
