import { ReactNode } from "react";
import { Text } from "@/design-system";
import { LucideIcon } from "lucide-react";

interface SettingsItemProps {
  icon: LucideIcon;
  label: string;
  description: string;
  children: ReactNode;
}

export const SettingsItem = ({
  icon: Icon,
  label,
  description,
  children,
}: SettingsItemProps) => {
  return (
    <div className="border-border flex items-center gap-3 border-b py-3 first-of-type:pt-0">
      <Icon className="text-text-muted h-4 w-4" />

      <div className="min-w-0 flex-1">
        <Text variant="body" className="font-medium">
          {label}
        </Text>
        <Text variant="small" color="muted" className="truncate">
          {description}
        </Text>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
};
