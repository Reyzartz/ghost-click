import React, { memo } from "react";
import { Text } from "@/design-system";

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export const SettingsSection = memo(
  ({ title, children }: SettingsSectionProps) => {
    return (
      <div>
        <Text variant="caption" color="muted" className="mb-2">
          {title}
        </Text>
        <div className="space-y-2">{children}</div>
      </div>
    );
  }
);

export default SettingsSection;
