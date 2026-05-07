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
  sm: "max-w-xs",
  md: "max-w-sm",
  lg: "max-w-md",
  xl: "max-w-lg",
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
            className={clsx(
              "absolute",
              maxWidth === "sm" ? "top-2 right-2" : "top-1.5 right-1.5"
            )}
            variant="ghost"
            size={maxWidth === "sm" ? "sm" : "md"}
            color="secondary"
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
    <div className={clsx("p-3", className)} {...props}>
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
  borderless?: boolean;
}

export const ModalBody = ({
  children,
  className,
  borderless = false,
  ...props
}: ModalBodyProps) => {
  return (
    <div
      className={clsx(
        "scrollbar max-h-120 overflow-scroll px-3 py-3",
        borderless ? "pt-0" : "border-y",
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
  visible?: boolean;
}

export const ModalFooter = ({
  children,
  className,
  visible = true,
  ...props
}: ModalFooterProps) => {
  return (
    <div
      className={clsx(
        "bg-background-secondary flex justify-end gap-2 overflow-hidden px-2 transition-[max-height,opacity,padding] duration-200",
        className,
        visible ? "max-h-14 py-2 opacity-100" : "max-h-0 py-0 opacity-0"
      )}
      {...props}
    >
      {children}
    </div>
  );
};
