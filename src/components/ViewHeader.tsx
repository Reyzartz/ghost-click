import { Button, Text } from "@/design-system";
import { ChevronLeft } from "lucide-react";

interface ViewHeaderProps {
  title: string;
  onBack: () => void;
  showBorder?: boolean;
  className?: string;
}

export const ViewHeader = ({
  title,
  onBack,
  showBorder = false,
  className = "",
}: ViewHeaderProps) => {
  const borderClass = showBorder ? "border-b border-gray-200" : "";

  return (
    <div
      className={`flex items-center gap-2 px-4 py-3 ${borderClass} ${className}`}
    >
      <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
        <ChevronLeft className="h-4 w-4" />
        Back
      </Button>
      <Text variant="h3" className="flex-1">
        {title}
      </Text>
    </div>
  );
};
