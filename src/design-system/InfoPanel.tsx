import { HTMLAttributes, ReactNode } from "react";
import { Card } from "./Card";
import { Text } from "./Text";

interface InfoPanelProps extends HTMLAttributes<HTMLDivElement> {
  items: Array<{
    label: string;
    value: ReactNode;
  }>;
}

export const InfoPanel = ({
  items,
  className = "",
  ...props
}: InfoPanelProps) => {
  return (
    <Card
      padding="md"
      className={["bg-slate-50 space-y-2", className].filter(Boolean).join(" ")}
      {...props}
    >
      {items.map((item, index) => (
        <div key={index} className="flex justify-between">
          <Text variant="body" color="muted">
            {item.label}:
          </Text>
          <Text variant="body" className="font-medium">
            {item.value}
          </Text>
        </div>
      ))}
    </Card>
  );
};
