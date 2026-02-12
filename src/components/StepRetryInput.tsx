import { memo } from "react";
import { Text, Input } from "@/design-system";

interface StepRetryInputProps {
  retryCount: number;
  retryInterval: number;
  onChange: (updates: { retryCount: number; retryInterval: number }) => void;
  retryCountError?: string;
  retryIntervalError?: string;
}

const StepRetryInput = memo<StepRetryInputProps>(
  ({
    retryCount,
    retryInterval,
    onChange,
    retryCountError,
    retryIntervalError,
  }) => {
    return (
      <div className="flex flex-col gap-2">
        <Text variant="small" color="muted" className="font-medium">
          Retry Settings:
        </Text>

        <div className="border-border bg-surface-muted flex flex-col gap-2 rounded border p-2">
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
            error={retryCountError}
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
            error={retryIntervalError}
          />
        </div>
      </div>
    );
  }
);

export { StepRetryInput };
