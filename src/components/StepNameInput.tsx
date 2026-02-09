import { memo } from "react";
import { Input } from "@/design-system";

interface StepNameInputProps {
  name: string;
  onChange: (name: string) => void;
  error?: string;
}

const StepNameInput = memo<StepNameInputProps>(({ name, onChange, error }) => {
  return (
    <Input
      type="text"
      value={name}
      onChange={(e) => onChange(e.target.value)}
      autoFocus
      label="Step Name"
      required
      error={error}
    />
  );
});

export { StepNameInput };
