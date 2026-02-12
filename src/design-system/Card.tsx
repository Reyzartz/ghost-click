import { HTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

const paddingStyles = {
  none: "",
  sm: "p-2",
  md: "p-4",
  lg: "p-6",
};

export const Card = ({
  children,
  padding = "md",
  hover = false,
  className,
  ...props
}: CardProps) => {
  const classes = clsx(
    "rounded border border-border bg-surface",
    paddingStyles[padding],
    hover && "hover:border-border-hover transition-colors",
    className
  );

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};
