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

      <div className="flex h-full flex-1 flex-col gap-3 overflow-hidden p-4">
        {children}
      </div>
    </div>
  );
});

interface HeaderProps {
  title: string;
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
        "bg-surface flex items-center gap-1.5 px-2 py-1.5",
        showBorder && "border-border border-b",
        className
      )}
    >
      {onBack && (
        <Button variant="ghost" size="sm" onClick={onBack} icon={ChevronLeft} />
      )}

      <Text variant="h3">{title}</Text>

      <div className="flex flex-1 justify-end gap-2 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

const LayoutWithComponents = Object.assign(Layout, { Header });

export { LayoutWithComponents as Layout };
