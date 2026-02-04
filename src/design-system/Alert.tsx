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
        "rounded border px-3 py-2 text-sm",
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
