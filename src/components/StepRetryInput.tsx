import { memo } from "react";
import { Text, Input } from "@/design-system";

interface StepRetryInputProps {
  retryCount: number;
  retryInterval: number;
  onChange: (updates: { retryCount: number; retryInterval: number }) => void;
}

const StepRetryInput = memo<StepRetryInputProps>(
  ({ retryCount, retryInterval, onChange }) => {
    return (
      <div className="flex flex-col gap-2 border border-slate-200 rounded p-2 bg-slate-50">
        <Text variant="small" color="muted" className="font-medium">
          Retry Settings:
        </Text>
        <div className="flex items-center gap-2">
          <Text variant="small" color="muted" className="w-20">
            Count:
          </Text>
          <Input
            type="number"
            min={0}
            max={10}
            value={retryCount}
            onChange={(e) =>
              onChange({
                retryCount: parseInt(e.target.value) || 0,
                retryInterval,
              })
            }
            className="flex-1 text-xs"
            placeholder="0"
            fullWidth={false}
          />
        </div>

        <div className="flex items-center gap-2">
          <Text variant="caption" color="muted" className="w-20 normal-case">
            Interval (ms):
          </Text>
          <Input
            type="number"
            min={0}
            max={10000}
            step={100}
            value={retryInterval}
            onChange={(e) =>
              onChange({
                retryCount,
                retryInterval: parseInt(e.target.value) || 0,
              })
            }
            className="flex-1 text-xs"
            placeholder="1000"
            fullWidth={false}
          />
        </div>
      </div>
    );
  }
);

export { StepRetryInput };
