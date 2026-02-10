import { MacroStep } from "@/models";
import { Text } from "@/design-system";
import clsx from "clsx";

interface StepMetaProps {
  step: MacroStep;
  className?: string;
}

export const StepMeta = ({ step, className }: StepMetaProps) => {
  const getMetaInfo = (): string => {
    switch (step.type) {
      case "CLICK": {
        const selector = step.target[step.target.defaultSelector];
        const clickText = step.clicksCount === 1 ? "click" : "clicks";
        return `${step.clicksCount}× ${clickText} on ${selector}`;
      }
      case "INPUT": {
        const selector = step.target[step.target.defaultSelector];
        const preview = step.value ? step.value.substring(0, 20) : "empty";
        const suffix = step.value.length > 20 ? "..." : "";
        return `"${preview}${suffix}" → ${selector}`;
      }
      case "KEYPRESS": {
        const modifiers = [
          step.ctrlKey && "Ctrl",
          step.altKey && "Alt",
          step.shiftKey && "Shift",
          step.metaKey && "Cmd",
        ]
          .filter(Boolean)
          .join("+");
        const key = modifiers ? `${modifiers}+${step.key}` : step.key;
        return key;
      }
      case "NAVIGATE":
        return step.url;
      default:
        return "";
    }
  };

  return (
    <Text
      variant="xs"
      color="muted"
      className={clsx("max-w-min truncate", className)}
    >
      {getMetaInfo()}
    </Text>
  );
};
