import { HTMLAttributes, ReactNode, ElementType } from "react";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";

const textVariants = cva("", {
  variants: {
    variant: {
      h1: "text-2xl font-bold",
      h2: "text-lg font-semibold",
      h3: "text-base font-semibold",
      h4: "text-sm font-medium",
      h5: "text-xs font-medium",
      body: "text-sm",
      small: "text-xs",
      xs: "text-[10px]",
      caption: "text-xs uppercase tracking-wide",
    },
    color: {
      default: "text-text",
      info: "text-info-text",
      muted: "text-text-muted",
      success: "text-success-text",
      error: "text-error-text",
      warning: "text-warning-text",
    },
  },
  defaultVariants: {
    variant: "body",
    color: "default",
  },
});

type TextVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "body"
  | "xs"
  | "small"
  | "caption";
export type TextColor =
  | "default"
  | "muted"
  | "success"
  | "error"
  | "warning"
  | "info";

interface TextProps extends HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  color?: TextColor;
  children: ReactNode;
  as?: ElementType;
}

export const Text = ({
  variant = "body",
  color = "default",
  children,
  as,
  className,
  ...props
}: TextProps) => {
  const Component: ElementType =
    as ||
    (variant === "h1" || variant === "h2" || variant === "h3" ? variant : "p");

  const classes = clsx(textVariants({ variant, color }), className);

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};
