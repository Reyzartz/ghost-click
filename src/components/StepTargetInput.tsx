import { TargetElementSelector } from "@/models";
import { memo } from "react";

interface StepTargetInputProps {
  target: TargetElementSelector;
  onChange: (target: TargetElementSelector) => void;
}

const StepTargetInput = memo<StepTargetInputProps>(({ target, onChange }) => {
  return (
    <div className="flex flex-col gap-2 border border-slate-200 rounded p-2 bg-slate-50">
      <div className="text-slate-600 text-xs font-medium">Target Selector:</div>
      <div className="flex items-center gap-2">
        <label className="text-slate-600 w-20 text-[10px]">ID:</label>
        <input
          type="text"
          value={target.id}
          onChange={(e) => onChange({ ...target, id: e.target.value })}
          className="flex-1 border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-slate-500"
          placeholder="element-id"
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-slate-600 w-20 text-[10px]">Class:</label>
        <input
          type="text"
          value={target.className}
          onChange={(e) => onChange({ ...target, className: e.target.value })}
          className="flex-1 border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-slate-500"
          placeholder="class-name"
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-slate-600 w-20 text-[10px]">XPath:</label>
        <input
          type="text"
          value={target.xpath}
          onChange={(e) => onChange({ ...target, xpath: e.target.value })}
          className="flex-1 border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-slate-500"
          placeholder="//div[@id='example']"
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-slate-600 w-20 text-[10px]">Default:</label>
        <select
          value={target.defaultSelector}
          onChange={(e) =>
            onChange({
              ...target,
              defaultSelector: e.target.value as "id" | "className" | "xpath",
            })
          }
          className="flex-1 border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-slate-500 bg-white cursor-pointer"
        >
          <option value="id">ID</option>
          <option value="className">Class</option>
          <option value="xpath">XPath</option>
        </select>
      </div>
    </div>
  );
});

export { StepTargetInput };
