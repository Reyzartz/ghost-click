import { HTMLAttributes, ReactNode } from "react";

export type AlertVariant = "success" | "error" | "warning" | "info";

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  children: ReactNode;
  icon?: string;
}

const variantStyles: Record<AlertVariant, { container: string; icon: string }> =
  {
    success: {
      container: "bg-green-50 border-green-200 text-green-800",
      icon: "text-green-600",
    },
    error: {
      container: "bg-red-50 border-red-200 text-red-800",
      icon: "text-red-600",
    },
    warning: {
      container: "bg-amber-50 border-amber-200 text-amber-800",
      icon: "text-amber-600",
    },
    info: {
      container: "bg-blue-50 border-blue-200 text-blue-800",
      icon: "text-blue-600",
    },
  };

const defaultIcons: Record<AlertVariant, string> = {
  success: "✓",
  error: "⚠",
  warning: "⚠",
  info: "ℹ",
};

export const Alert = ({
  variant = "info",
  children,
  icon,
  className = "",
  ...props
}: AlertProps) => {
  const styles = variantStyles[variant];
  const displayIcon = icon !== undefined ? icon : defaultIcons[variant];

  return (
    <div
      className={[
        "rounded border px-3 py-2 text-sm",
        styles.container,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {displayIcon && (
        <div className="flex items-center gap-2">
          <span className={`text-base ${styles.icon}`}>{displayIcon}</span>
          <span>{children}</span>
        </div>
      )}
      {!displayIcon && children}
    </div>
  );
};
