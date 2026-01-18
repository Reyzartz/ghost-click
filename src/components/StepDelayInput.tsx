import { memo } from "react";

interface StepDelayInputProps {
  delay: number;
  onChange: (delay: number) => void;
}

const StepDelayInput = memo<StepDelayInputProps>(({ delay, onChange }) => {
  return (
    <div className="flex flex-col gap-2 border border-slate-200 rounded p-2 bg-slate-50">
      <div className="text-slate-600 text-xs font-medium">Delay:</div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          max="60000"
          step="100"
          value={delay}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          className="flex-1 border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-slate-500"
          placeholder="1000"
        />
        <span className="text-slate-600 text-xs">ms</span>
      </div>
    </div>
  );
});

export { StepDelayInput };
