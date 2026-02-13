import { HTMLAttributes, ReactNode, forwardRef, ElementType } from "react";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";

export type CardVariant =
  | "default"
  | "selected"
  | "current"
  | "completed"
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
}

const cardVariants = cva("rounded border transition-colors list-none", {
  variants: {
    variant: {
      default: "border-border bg-surface",
      selected: "border-border-secondary bg-surface-hover",
      current: "border-success-border bg-success-bg-hover font-medium",
      completed: "border-border bg-surface-hover text-text-muted",
      errored: "border-error-border bg-error-bg text-error-text",
      deleted: "border-error-border bg-error-bg opacity-50",
    },
    size: {
      sm: "px-2 py-1.5",
      md: "px-3 py-2",
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
      className: "hover:bg-surface-hover",
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
      }),
      className
    );

    return (
      <Component
        ref={(el: HTMLElement | null) => {
          if (
            autoScroll &&
            el &&
            (variant === "current" || variant === "selected")
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
        onClick={onClick}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = "Card";
