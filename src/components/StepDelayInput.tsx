import { memo } from "react";
import { Input, Text } from "@/design-system";

interface StepDelayInputProps {
  delay: number;
  onChange: (delay: number) => void;
}

const StepDelayInput = memo<StepDelayInputProps>(({ delay, onChange }) => {
  return (
    <div className="flex flex-col gap-2 border border-slate-200 rounded p-2 bg-slate-50">
      <Text variant="small" color="muted" className="font-medium">
        Delay:
      </Text>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={0}
          max={60000}
          step={100}
          value={delay}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          className="flex-1 text-xs"
          placeholder="1000"
          fullWidth={false}
        />
        <Text variant="small" color="muted">
          ms
        </Text>
      </div>
    </div>
  );
});

export { StepDelayInput };
