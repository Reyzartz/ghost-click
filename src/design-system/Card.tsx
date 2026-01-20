import { HTMLAttributes, ReactNode } from "react";

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
  className = "",
  ...props
}: CardProps) => {
  const classes = [
    "rounded border border-slate-200 bg-white",
    paddingStyles[padding],
    hover ? "hover:border-slate-300 transition-colors" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};
