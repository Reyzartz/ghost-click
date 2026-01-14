import { memo } from "react";

interface StepNameInputProps {
  name: string;
  onChange: (name: string) => void;
}

const StepNameInput = memo<StepNameInputProps>(({ name, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <label className="text-slate-600 w-12">Name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => onChange(e.target.value.trim())}
        className="border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-slate-500"
        autoFocus
      />
    </div>
  );
});

export { StepNameInput };
