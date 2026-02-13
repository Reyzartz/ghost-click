import React, { memo } from "react";
import { Text } from "@/design-system";

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export const SettingsSection = memo(
  ({ title, children }: SettingsSectionProps) => {
    return (
      <div className="mb-4">
        <Text variant="h4" className="mb-2">
          {title}
        </Text>
        <div className="space-y-2">{children}</div>
      </div>
    );
  }
);

export default SettingsSection;
