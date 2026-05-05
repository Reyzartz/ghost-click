import { Text } from "@/design-system";

interface ProgressBarProps {
  current: number;
  total: number;
  percentage: number;
}

export const ProgressBar = ({
  current,
  total,
  percentage,
}: ProgressBarProps) => {
  return (
    <div className="flex-1 space-y-2">
      <div className="bg-border h-2 w-full overflow-hidden rounded-full">
        <div
          className="bg-success-icon h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <Text variant="small" color="muted">
          Step {current} of {total}
        </Text>
        <Text variant="small" color="muted">
          {percentage}%
        </Text>
      </div>
    </div>
  );
};
