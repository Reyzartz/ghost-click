import { memo } from "react";
import { Text, Input } from "@/design-system";

interface StepNameInputProps {
  name: string;
  onChange: (name: string) => void;
}

const StepNameInput = memo<StepNameInputProps>(({ name, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <Text variant="small" color="muted" className="w-12">
        Name:
      </Text>
      <Input
        type="text"
        value={name}
        onChange={(e) => onChange(e.target.value.trim())}
        className="text-xs"
        autoFocus
        fullWidth={false}
      />
    </div>
  );
});

export { StepNameInput };
