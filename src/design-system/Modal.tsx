import { HTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";
import { LucideIcon, X } from "lucide-react";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { Text } from "./Text";

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  zIndex?: number;
}

const maxWidthStyles = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export const Modal = ({
  isOpen,
  onClose,
  children,
  maxWidth = "md",
  zIndex = 99999,
  className,
  ...props
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      style={{ zIndex }}
      onClick={onClose}
      {...props}
    >
      <div
        className={clsx(
          "bg-surface relative mx-3 w-full overflow-hidden rounded-lg shadow-xl",
          maxWidthStyles[maxWidth],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {onClose && (
          <Button
            icon={X}
            onClick={onClose}
            className="absolute top-2 right-2"
            variant="ghost"
          />
        )}
        {children}
      </div>
    </div>
  );
};

interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "dark";
  title?: string;
  icon?: LucideIcon;
}

export const ModalHeader = ({
  children,
  className,
  title,
  icon,
  ...props
}: ModalHeaderProps) => {
  return (
    <div className={clsx("p-3 pb-0", className)} {...props}>
      <div className="flex items-center gap-2 empty:hidden">
        {icon && <Icon icon={icon} />}
        {title && <Text variant="h3">{title}</Text>}
      </div>

      {children}
    </div>
  );
};

interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const ModalBody = ({
  children,
  className,
  ...props
}: ModalBodyProps) => {
  return (
    <div
      className={clsx(
        "scrollbar my-3 max-h-120 overflow-scroll px-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const ModalFooter = ({
  children,
  className,
  ...props
}: ModalFooterProps) => {
  return (
    <div className={clsx("flex gap-2 p-3 pt-0", className)} {...props}>
      {children}
    </div>
  );
};
