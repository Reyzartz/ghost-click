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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Text variant="small" color="muted">
          Step {current} of {total}
        </Text>
        <Text variant="small" color="muted">
          {percentage}%
        </Text>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-green-600 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
