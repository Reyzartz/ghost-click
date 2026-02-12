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
    return <div className={clsx("bg-border w-px", className)} {...props} />;
  }

  return (
    <hr
      className={clsx(
        "border-border border-0 border-t",
        spacingStyles[spacing],
        className
      )}
      {...props}
    />
  );
};
