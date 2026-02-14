import { forwardRef, InputHTMLAttributes } from "react";
import { clsx } from "clsx";
import { Text } from "./Text";

export type ToggleSize = "sm" | "md" | "lg";

interface ToggleProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "size"
> {
  label?: string;
  size?: ToggleSize;
  fullWidth?: boolean;
}

const trackSizeClasses: Record<ToggleSize, string> = {
  sm: "w-8 h-4",
  md: "w-10 h-6",
  lg: "w-12 h-7",
};

const thumbSizeClasses: Record<ToggleSize, string> = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    { label, className, size = "md", fullWidth = false, disabled, ...props },
    ref
  ) => {
    return (
      <label className={clsx("flex items-center gap-3", fullWidth && "w-full")}>
        {label && (
          <Text variant="small" color="muted" className="block">
            {label}
          </Text>
        )}

        <div
          className={clsx(
            "relative inline-flex items-center",
            trackSizeClasses[size],
            disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
            className
          )}
        >
          <input
            ref={ref}
            type="checkbox"
            role="switch"
            aria-checked={props.checked}
            disabled={disabled}
            className="sr-only"
            {...props}
          />

          <span
            className={clsx(
              "absolute inset-0 rounded-full transition-colors",
              props.checked ? "bg-success" : "bg-surface-active"
            )}
            aria-hidden
          />

          <span
            className={clsx(
              "absolute top-1/2 left-1 -translate-y-1/2 transform rounded-full bg-white shadow-sm transition-transform",
              thumbSizeClasses[size],
              props.checked ? "translate-x-full" : "translate-x-0"
            )}
            aria-hidden
          />
        </div>
      </label>
    );
  }
);

Toggle.displayName = "Toggle";

export default Toggle;
