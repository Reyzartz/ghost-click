import { HTMLAttributes, ReactNode } from "react";
import { IconButton } from "./IconButton";
import { X } from "lucide-react";

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
  className = "",
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
        className={[
          "bg-white rounded-lg shadow-xl w-full mx-4 overflow-hidden relative",
          maxWidthStyles[maxWidth],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
        {onClose && (
          <IconButton
            icon={X}
            onClick={onClose}
            className="absolute right-3 top-3"
            variant="ghost"
          />
        )}
        {children}
      </div>
    </div>
  );
};

interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "dark";
}

export const ModalHeader = ({
  children,
  className = "",
  ...props
}: ModalHeaderProps) => {
  return (
    <div
      className={["p-4 pb-0", className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </div>
  );
};

interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const ModalBody = ({
  children,
  className = "",
  ...props
}: ModalBodyProps) => {
  return (
    <div
      className={["px-4 my-4 max-h-120 overflow-scroll scrollbar", className]
        .filter(Boolean)
        .join(" ")}
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
  className = "",
  ...props
}: ModalFooterProps) => {
  return (
    <div
      className={["p-4 pt-0 flex gap-2", className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </div>
  );
};
