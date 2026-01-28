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
      <div className="flex flex-col gap-2">
        <Text variant="small" color="muted" className="font-medium">
          Retry Settings:
        </Text>

        <div className="flex flex-col gap-2 rounded border border-slate-200 bg-slate-50 p-2">
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
            placeholder="0"
            label="Retry Count"
          />

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
            placeholder="1000"
            label="Interval (ms)"
          />
        </div>
      </div>
    );
  }
);

export { StepRetryInput };
