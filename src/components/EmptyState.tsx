import { Card } from "@/design-system";

interface EmptyStateProps {
  message: string;
}

export const EmptyState = ({ message }: EmptyStateProps) => {
  return <Card className="bg-slate-50 text-slate-600">{message}</Card>;
};
