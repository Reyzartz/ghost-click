import { memo, ReactNode } from "react";
import { Card, Text } from "@/design-system";
import { LucideIcon } from "lucide-react";

interface SettingsItemProps {
  icon: LucideIcon;
  label: string;
  description: string;
  children: ReactNode;
}

export const SettingsItem = memo(
  ({ icon: Icon, label, description, children }: SettingsItemProps) => {
    return (
      <Card className="flex items-center gap-3">
        <Icon className="text-text-muted h-4 w-4" />

        <div className="min-w-0 flex-1">
          <Text variant="body" className="font-medium">
            {label}
          </Text>
          <Text variant="small" color="muted" className="truncate">
            {description}
          </Text>
        </div>

        <div className="w-28">{children}</div>
      </Card>
    );
  }
);
