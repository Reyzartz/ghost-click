import { memo } from "react";

interface StepRetryInputProps {
  retryCount: number;
  retryInterval: number;
  onChange: (updates: { retryCount: number; retryInterval: number }) => void;
}

const StepRetryInput = memo<StepRetryInputProps>(
  ({ retryCount, retryInterval, onChange }) => {
    return (
      <div className="flex flex-col gap-2 border border-slate-200 rounded p-2 bg-slate-50">
        <div className="text-slate-600 text-xs font-medium">Retry Settings:</div>
        <div className="flex items-center gap-2">
          <label className="text-slate-600 w-20 text-[10px]">Count:</label>
          <input
            type="number"
            min="0"
            max="10"
            value={retryCount}
            onChange={(e) =>
              onChange({
                retryCount: parseInt(e.target.value) || 0,
                retryInterval,
              })
            }
            className="flex-1 border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-slate-500"
            placeholder="0"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-slate-600 w-20 text-[10px]">Interval (ms):</label>
          <input
            type="number"
            min="0"
            max="10000"
            step="100"
            value={retryInterval}
            onChange={(e) =>
              onChange({
                retryCount,
                retryInterval: parseInt(e.target.value) || 0,
              })
            }
            className="flex-1 border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-slate-500"
            placeholder="1000"
          />
        </div>
      </div>
    );
  }
);

export { StepRetryInput };
