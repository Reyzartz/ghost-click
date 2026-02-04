import { HTMLAttributes } from "react";
import { clsx } from "clsx";

interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical";
  spacing?: "none" | "sm" | "md" | "lg";
}

const spacingStyles = {
  none: "",
  sm: "my-2",
  md: "my-4",
  lg: "my-6",
};

export const Divider = ({
  orientation = "horizontal",
  spacing = "none",
  className,
  ...props
}: DividerProps) => {
  if (orientation === "vertical") {
    return <div className={clsx("w-px bg-slate-200", className)} {...props} />;
  }

  return (
    <hr
      className={clsx(
        "border-0 border-t border-slate-200",
        spacingStyles[spacing],
        className
      )}
      {...props}
    />
  );
};
