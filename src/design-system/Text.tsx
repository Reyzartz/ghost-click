import { HTMLAttributes, ReactNode, ElementType } from "react";

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
export type TextColor = "default" | "muted" | "success" | "error" | "warning";

interface TextProps extends HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  color?: TextColor;
  children: ReactNode;
  as?: ElementType;
}

const variantStyles: Record<TextVariant, string> = {
  h1: "text-2xl font-bold",
  h2: "text-lg font-semibold",
  h3: "text-base font-semibold",
  h4: "text-sm font-medium",
  h5: "text-xs font-medium",
  body: "text-sm",
  small: "text-xs",
  xs: "text-[10px]",
  caption: "text-xs uppercase tracking-wide",
};

const colorStyles: Record<TextColor, string> = {
  default: "text-slate-900",
  muted: "text-slate-500",
  success: "text-green-700",
  error: "text-red-700",
  warning: "text-amber-700",
};

export const Text = ({
  variant = "body",
  color = "default",
  children,
  as,
  className = "",
  ...props
}: TextProps) => {
  const Component: ElementType =
    as ||
    (variant === "h1" || variant === "h2" || variant === "h3" ? variant : "p");

  const classes = [variantStyles[variant], colorStyles[color], className]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};
