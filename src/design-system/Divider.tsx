import { HTMLAttributes } from "react";

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
  className = "",
  ...props
}: DividerProps) => {
  if (orientation === "vertical") {
    return (
      <div
        className={["w-px bg-slate-200", className].filter(Boolean).join(" ")}
        {...props}
      />
    );
  }

  return (
    <hr
      className={[
        "border-0 border-t border-slate-200",
        spacingStyles[spacing],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
};
