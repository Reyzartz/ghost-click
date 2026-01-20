import { HTMLAttributes, ReactNode } from "react";
import { Card } from "./Card";

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
        <div key={index} className="flex justify-between text-sm">
          <span className="text-slate-600">{item.label}:</span>
          <span className="font-medium text-slate-900">{item.value}</span>
        </div>
      ))}
    </Card>
  );
};
