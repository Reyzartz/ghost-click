import { memo, ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { Card, Text } from "@/design-system";

interface SettingsCardProps {
  label: string;
  description?: string;
  icon?: LucideIcon;
  children: ReactNode;
}

export const SettingsCard = memo(
  ({ label, description, icon: Icon, children }: SettingsCardProps) => {
    return (
      <Card className="flex items-center justify-between overflow-hidden">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          {Icon && <Icon className="text-text-muted h-4 w-4 shrink-0" />}
          <div className="min-w-0 flex-1">
            <Text variant="body" className="font-medium">
              {label}
            </Text>
            {description && (
              <Text variant="small" color="muted">
                {description}
              </Text>
            )}
          </div>
        </div>
        {children}
      </Card>
    );
  }
);
