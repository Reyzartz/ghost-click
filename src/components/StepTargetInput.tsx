import { TargetElementSelector } from "@/models";
import { memo, useEffect, useState } from "react";
import { Square, Search } from "lucide-react";
import { Text, Button, Input } from "@/design-system";

interface StepTargetInputProps {
  target: TargetElementSelector;
  onChange: (target: TargetElementSelector) => void;
}

const StepTargetInput = memo<StepTargetInputProps>(({ target, onChange }) => {
  const [isInspecting, setIsInspecting] = useState(false);

  useEffect(() => {
    const handleMessage = (message: any) => {
      if (
        message.type === "EMIT_EVENT" &&
        message.event === "ELEMENT_SELECTED"
      ) {
        onChange(message.data.selector);
        setIsInspecting(false);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [onChange]);

  const startInspection = async (): Promise<void> => {
    setIsInspecting(true);

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab.id) return;

    await chrome.tabs.sendMessage(tab.id, {
      type: "EMIT_EVENT",
      event: "START_ELEMENT_INSPECTION",
      source: "sidepanel",
    });
  };

  const stopInspection = async (): Promise<void> => {
    setIsInspecting(false);

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab.id) return;

    await chrome.tabs.sendMessage(tab.id, {
      type: "EMIT_EVENT",
      event: "STOP_ELEMENT_INSPECTION",
      source: "sidepanel",
    });
  };

  return (
    <div className="flex flex-col gap-2 border border-slate-200 rounded p-2 bg-slate-50">
      <div className="flex items-center justify-between">
        <Text variant="small" color="muted" className="font-medium">
          Target Selector:
        </Text>
        <Button
          onClick={isInspecting ? stopInspection : startInspection}
          variant={isInspecting ? "danger" : "primary"}
          size="sm"
          icon={isInspecting ? Square : Search}
          title={isInspecting ? "Stop inspection" : "Inspect element on page"}
        >
          {isInspecting ? "Stop" : "Inspect"}
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Text variant="small" color="muted" className="w-20">
          ID:
        </Text>
        <Input
          type="text"
          value={target.id}
          onChange={(e) => onChange({ ...target, id: e.target.value })}
          className="flex-1 text-xs"
          placeholder="element-id"
          fullWidth={false}
        />
      </div>

      <div className="flex items-center gap-2">
        <Text variant="small" color="muted" className="w-20">
          Class:
        </Text>
        <Input
          type="text"
          value={target.className}
          onChange={(e) => onChange({ ...target, className: e.target.value })}
          className="flex-1 text-xs"
          placeholder="class-name"
          fullWidth={false}
        />
      </div>

      <div className="flex items-center gap-2">
        <Text variant="small" color="muted" className="w-20">
          XPath:
        </Text>
        <Input
          type="text"
          value={target.xpath}
          onChange={(e) => onChange({ ...target, xpath: e.target.value })}
          className="flex-1 text-xs"
          placeholder="//div[@id='example']"
          fullWidth={false}
        />
      </div>

      <div className="flex items-center gap-2">
        <Text variant="small" color="muted" className="w-20">
          Default:
        </Text>
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
