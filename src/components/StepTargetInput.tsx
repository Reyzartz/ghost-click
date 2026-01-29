import { TargetElementSelector } from "@/models";
import { memo, useEffect, useState } from "react";
import { Square, Search } from "lucide-react";
import { Text, Button, Input, Select } from "@/design-system";
import { TabsManager } from "@/utils/TabsManager";

interface StepTargetInputProps {
  target: TargetElementSelector;
  onChange: (target: TargetElementSelector) => void;
}

const StepTargetInput = memo<StepTargetInputProps>(({ target, onChange }) => {
  const [isInspecting, setIsInspecting] = useState(false);

  useEffect(() => {
    const handleMessage = (message: {
      type: string;
      event?: string;
      data?: { selector: TargetElementSelector };
    }): void => {
      if (
        message.type === "EMIT_EVENT" &&
        message.event === "ELEMENT_SELECTED" &&
        message.data?.selector
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

    const activeTab = await TabsManager.getActiveTab();

    if (activeTab === null || !activeTab.id) return;

    await chrome.tabs.sendMessage(activeTab.id, {
      type: "EMIT_EVENT",
      event: "START_ELEMENT_INSPECTION",
      source: "sidepanel",
    });
  };

  const stopInspection = async (): Promise<void> => {
    setIsInspecting(false);

    const activeTab = await TabsManager.getActiveTab();

    if (activeTab === null || !activeTab.id) return;

    await chrome.tabs.sendMessage(activeTab.id, {
      type: "EMIT_EVENT",
      event: "STOP_ELEMENT_INSPECTION",
      source: "sidepanel",
    });
  };

  return (
    <div>
      <div className="mb-2 flex items-end justify-between">
        <Text variant="small" color="muted" className="font-medium">
          Target Selector:
        </Text>

        <div className="flex gap-2">
          {!isInspecting ? (
            <Button
              onClick={() => {
                void startInspection();
              }}
              variant="primary"
              size="sm"
              icon={Search}
              title="Inspect element on page"
            >
              Inspect
            </Button>
          ) : (
            <Button
              onClick={() => {
                void stopInspection();
              }}
              variant="danger"
              size="sm"
              icon={Square}
              title="Stop inspection"
            >
              Stop
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded border border-slate-200 bg-slate-50 p-2">
        <Input
          type="text"
          label="Element ID"
          value={target.id}
          onChange={(e) => onChange({ ...target, id: e.target.value })}
          placeholder="element-id"
        />

        <Input
          type="text"
          label="Classnames"
          value={target.className}
          onChange={(e) => onChange({ ...target, className: e.target.value })}
          placeholder="class-name"
        />

        <Input
          type="text"
          label="XPath"
          value={target.xpath}
          onChange={(e) => onChange({ ...target, xpath: e.target.value })}
          placeholder="//div[@id='example']"
          fullWidth
        />

        <Select
          value={target.defaultSelector}
          label="Default Element Selector"
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            onChange({
              ...target,
              defaultSelector: e.target.value as "id" | "className" | "xpath",
            })
          }
        >
          <option value="id">ID</option>
          <option value="className">Class</option>
          <option value="xpath">XPath</option>
        </Select>
      </div>
    </div>
  );
});

export { StepTargetInput };
