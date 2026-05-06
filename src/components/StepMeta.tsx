import {
  ElementSelectorType,
  MacroStep,
  TargetElementSelector,
} from "@/models";
import { Icon, Kbd, Text } from "@/design-system";
import clsx from "clsx";
import { Dot } from "lucide-react";
import { ReactNode, useMemo } from "react";

interface StepMetaProps {
  step: MacroStep;
  className?: string;
}

const SELECTOR_PREFIX: Record<ElementSelectorType, string> = {
  id: "#",
  className: ".",
  xpath: "",
};

function formatSelector(target: TargetElementSelector): string {
  const prefix = SELECTOR_PREFIX[target.defaultSelector];
  const value = target[target.defaultSelector];
  const full = `${prefix}${value}`;
  return full.length > 24 ? `${full.slice(0, 24)}…` : full;
}

function formatUrl(raw: string): string {
  try {
    const { hostname, pathname } = new URL(raw);
    const path = pathname === "/" ? "" : pathname;
    const display = `${hostname}${path}`;
    return display.length > 30 ? `${display.slice(0, 30)}…` : display;
  } catch {
    return raw.length > 30 ? `${raw.slice(0, 30)}…` : raw;
  }
}

export const StepMeta = ({ step, className }: StepMetaProps) => {
  const meta = useMemo((): ReactNode => {
    switch (step.type) {
      case "CLICK": {
        const selector = formatSelector(step.target);
        const countLabel =
          step.clicksCount === 2
            ? "Double"
            : step.clicksCount > 2
              ? `×${step.clicksCount}`
              : null;
        return (
          <>
            {countLabel && (
              <>
                <span>{countLabel}</span>
                <Icon icon={Dot} size="xs" color="muted" />
              </>
            )}
            <span className="truncate">{selector}</span>
          </>
        );
      }

      case "INPUT": {
        const selector = formatSelector(step.target);
        const raw = step.value;
        const preview = raw
          ? `"${raw.length > 16 ? `${raw.slice(0, 16)}…` : raw}"`
          : "empty";
        return (
          <>
            <span className="shrink-0">{preview}</span>
            <Icon icon={Dot} size="xs" color="muted" />
            <span className="truncate">{selector}</span>
          </>
        );
      }

      case "KEYPRESS": {
        const keys = [
          step.metaKey && "⌘",
          step.ctrlKey && "Ctrl",
          step.altKey && "Alt",
          step.shiftKey && "⇧",
          step.key,
        ].filter(Boolean) as string[];
        return (
          <span className="flex items-center gap-0.5">
            {keys.map((k, i) => (
              <Kbd key={i} size="sm">
                {k}
              </Kbd>
            ))}
          </span>
        );
      }

      case "NAVIGATE":
        return <span className="truncate">{formatUrl(step.url)}</span>;

      default:
        return null;
    }
  }, [step]);

  return (
    <div
      className={clsx(
        "flex max-w-full items-center gap-0.5 overflow-hidden",
        className
      )}
    >
      <Text variant="xs" color="muted" className="shrink-0">
        {step.delay}ms
      </Text>
      <Icon icon={Dot} size="xs" color="muted" />
      <Text
        variant="xs"
        color="muted"
        className="flex min-w-0 items-center gap-0.5"
      >
        {meta}
      </Text>
    </div>
  );
};
