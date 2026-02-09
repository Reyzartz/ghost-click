import { memo } from "react";
import { Input } from "@/design-system";

interface StepDelayInputProps {
  delay: number;
  onChange: (delay: number) => void;
  error?: string;
}

const StepDelayInput = memo<StepDelayInputProps>(
  ({ delay, onChange, error }) => {
    return (
      <Input
        type="number"
        min={0}
        max={60000}
        step={100}
        value={delay}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        placeholder="1000"
        label="Delay (ms)"
        error={error}
      />
    );
  }
);

export { StepDelayInput };
