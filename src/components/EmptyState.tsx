import { Card } from "@/design-system";

interface EmptyStateProps {
  message: string;
}

export const EmptyState = ({ message }: EmptyStateProps) => {
  return <Card className="bg-surface-muted text-text-muted">{message}</Card>;
};
