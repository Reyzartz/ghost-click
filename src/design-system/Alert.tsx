import { HTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  LucideIcon,
} from "lucide-react";
import { Icon } from "./Icon";
import { cva } from "class-variance-authority";

export type AlertVariant = "success" | "error" | "warning" | "info";

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  children: ReactNode;
  showIcon?: boolean;
}

const alertContainerStyles = cva("rounded px-3 py-2 text-xs border", {
  variants: {
    variant: {
      success: "bg-success-bg text-success-text border-success-border",
      error: "bg-error-bg text-error-text border-error-border",
      warning: "bg-warning-bg text-warning-text border-warning-border",
      info: "bg-info-bg text-info-text border-info-border",
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

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
  return (
    <div
      className={clsx(
        "rounded px-3 py-2 text-xs",
        alertContainerStyles({ variant }),
        className
      )}
      {...props}
    >
      {showIcon ? (
        <div className="flex items-center gap-2">
          <Icon icon={defaultIcons[variant]} size="sm" color={variant} />
          <span>{children}</span>
        </div>
      ) : (
        children
      )}
    </div>
  );
};
