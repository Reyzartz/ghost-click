import { memo, PropsWithChildren } from "react";
import { Button, Text } from "@/design-system";
import clsx from "clsx";
import { ChevronLeft } from "lucide-react";

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
  showBorder?: boolean;
  className?: string;
}

Layout.displayName = "Layout";

export const Header = ({
  title,
  onBack,
  showBorder = true,
  className = "",
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
        <Button variant="ghost" size="sm" onClick={onBack} icon={ChevronLeft} />
      )}

      {title && typeof title === "string" ? (
        <Text variant="h3">{title}</Text>
      ) : (
        title
      )}

      <div className="flex flex-1 items-center justify-end gap-1 overflow-hidden px-2">
        {children}
      </div>
    </div>
  );
};

const LayoutWithComponents = Object.assign(Layout, { Header });

export { LayoutWithComponents as Layout };
