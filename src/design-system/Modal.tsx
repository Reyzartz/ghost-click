import { HTMLAttributes, ReactNode } from "react";

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
          "bg-white rounded-lg shadow-xl w-full mx-4 overflow-hidden",
          maxWidthStyles[maxWidth],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
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
  variant = "default",
  className = "",
  ...props
}: ModalHeaderProps) => {
  const variantClass =
    variant === "dark"
      ? "bg-slate-900 text-white"
      : "bg-white border-b border-slate-200";

  return (
    <div
      className={["px-6 py-4", variantClass, className]
        .filter(Boolean)
        .join(" ")}
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
    <div className={["p-6", className].filter(Boolean).join(" ")} {...props}>
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
      className={["px-6 pb-4 flex gap-2", className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </div>
  );
};
