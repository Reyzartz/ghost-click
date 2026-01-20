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
      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-green-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
