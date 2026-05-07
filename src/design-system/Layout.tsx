import { memo, PropsWithChildren } from "react";
import { Button, Text } from "@/design-system";
import clsx from "clsx";
import { ChevronLeft } from "lucide-react";
import {
  ConfirmActionButton,
  ConfirmActionButtonProps,
} from "@/components/ConfirmActionButton";

interface LayoutProps {
  header?: React.ReactNode;
}

const Layout = memo(({ children, header }: PropsWithChildren<LayoutProps>) => {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {header && <header>{header}</header>}

      <div className="flex h-full flex-1 flex-col gap-3 overflow-hidden p-3">
        {children}
      </div>
    </div>
  );
});

interface HeaderProps {
  title?: string | React.ReactNode;
  onBack?: () => void;
  confirmAction?: Pick<
    ConfirmActionButtonProps,
    "title" | "message" | "confirmText" | "onConfirm" | "isDestructiveAction"
  >;
  showBorder?: boolean;
  className?: string;
}

Layout.displayName = "Layout";

export const Header = ({
  title,
  onBack,
  showBorder = true,
  className = "",
  confirmAction,
  children,
}: PropsWithChildren<HeaderProps>) => {
  return (
    <div
      className={clsx(
        "bg-surface flex h-11 items-center gap-1.5 overflow-hidden px-2",
        showBorder && "border-border h-11 border-b",
        className
      )}
    >
      {onBack && (
        <Button
          variant="ghost"
          color="secondary"
          size="sm"
          onClick={onBack}
          icon={ChevronLeft}
        />
      )}

      {confirmAction && (
        <ConfirmActionButton
          variant="ghost"
          color="secondary"
          size="sm"
          onClick={onBack}
          icon={ChevronLeft}
          {...confirmAction}
        />
      )}

      {title && typeof title === "string" ? (
        <Text variant="h3" className="truncate overflow-hidden">
          {title}
        </Text>
      ) : (
        title
      )}

      <div className="flex shrink-0 grow items-center justify-end gap-1 overflow-hidden pr-2">
        {children}
      </div>
    </div>
  );
};

const LayoutWithComponents = Object.assign(Layout, { Header });

export { LayoutWithComponents as Layout };
