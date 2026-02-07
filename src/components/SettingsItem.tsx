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
    <div className="flex items-center gap-3 border-b border-slate-200 py-3 first-of-type:pt-0">
      <Icon className="h-4 w-4 text-gray-600" />

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
