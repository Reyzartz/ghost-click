import { HTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  LucideIcon,
} from "lucide-react";

export type AlertVariant = "success" | "error" | "warning" | "info";

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  children: ReactNode;
  showIcon?: boolean;
}

const variantStyles: Record<AlertVariant, { container: string; icon: string }> =
  {
    success: {
      container: "bg-success-bg border-success-border text-success-text",
      icon: "text-success-icon",
    },
    error: {
      container: "bg-error-bg border-error-border text-error-text",
      icon: "text-error-icon",
    },
    warning: {
      container: "bg-warning-bg border-warning-border text-warning-text",
      icon: "text-warning-icon",
    },
    info: {
      container: "bg-info-bg border-info-border text-info-text",
      icon: "text-info-icon",
    },
  };

const defaultIcons: Record<AlertVariant, LucideIcon> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

export const Alert = ({
  variant = "info",
  children,
  showIcon = true,
  className,
  ...props
}: AlertProps) => {
  const styles = variantStyles[variant];
  const IconComponent = defaultIcons[variant];

  return (
    <div
      className={clsx(
        "rounded border px-3 py-2 text-xs",
        styles.container,
        className
      )}
      {...props}
    >
      {showIcon ? (
        <div className="flex items-center gap-2">
          <IconComponent size={16} className={styles.icon} />
          <span>{children}</span>
        </div>
      ) : (
        children
      )}
    </div>
  );
};
