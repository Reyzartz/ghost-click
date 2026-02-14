import { TargetElementSelector } from "@/models";
import { memo, useEffect, useState } from "react";
import { Square, Search } from "lucide-react";
import { Text, Button, Input, Select, Card } from "@/design-system";
import { TabsManager } from "@/utils/TabsManager";
import { ElementSelectedEvent } from "@/utils/Event";

interface StepTargetInputProps {
  target: TargetElementSelector;
  onChange: (target: TargetElementSelector) => void;
  error?: string;
}

const StepTargetInput = memo<StepTargetInputProps>(
  ({ target, onChange, error }) => {
    const [isInspecting, setIsInspecting] = useState(false);

    useEffect(() => {
      const handleMessage = (message: {
        type: string;
        event?: string;
        data?: ElementSelectedEvent["data"];
      }): void => {
        if (
          message.type === "EMIT_EVENT" &&
          message.event === "ELEMENT_SELECTED" &&
          message.data?.target
        ) {
          onChange(message.data.target);
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
        </div>

        <Card
          className="relative flex flex-col gap-2"
          variant={error ? "errored" : "secondary"}
        >
          <div className="flex items-center gap-2 border-b pb-2">
            {!isInspecting ? (
              <Button
                onClick={() => {
                  void startInspection();
                }}
                variant="secondary"
                size="sm"
                icon={Search}
                title="Inspect element on page"
              />
            ) : (
              <Button
                onClick={() => {
                  void stopInspection();
                }}
                variant="danger"
                size="sm"
                icon={Square}
                title="Stop inspection"
              />
            )}

            <Text variant="xs" color="muted">
              Use the inspector to select an element on the page, or fill in the
              details below.
            </Text>
          </div>

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

          {error && (
            <Text variant="small" color="error">
              {error}
            </Text>
          )}
        </Card>
      </div>
    );
  }
);

export { StepTargetInput };
