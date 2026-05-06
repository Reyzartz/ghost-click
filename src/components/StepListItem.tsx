import { MacroStep } from "@/models";
import { Text, Card } from "@/design-system";
import { useMemo } from "react";
import StepIconWithState from "./StepIconWithState";

interface StepListItemProps {
  step: MacroStep;
  index: number;
  isCurrent: boolean;
  isCompleted: boolean;
  isErrored: boolean;
  isPaused: boolean;
  isPlaying: boolean;
}

export const StepListItem = ({
  step,
  isCurrent,
  isCompleted,
  isErrored,
  isPaused,
  isPlaying,
}: StepListItemProps) => {
  const cardVariant = useMemo(() => {
    if (isErrored) return "errored";
    if (isCurrent) return "selected";
    if (isCompleted) return "secondary";

    return "default";
  }, [isErrored, isCurrent, isCompleted]);

  const textAndIconColor = useMemo(() => {
    if (isCurrent && !isErrored) return "info";
    if (isCompleted && isErrored) return "error";
    if (isCompleted && !isErrored) return "success";
  }, [isCurrent, isCompleted, isErrored]);

  return (
    <Card
      as="li"
      variant={cardVariant}
      autoScroll={isCurrent}
      autoFocus={isCurrent}
    >
      <div className="flex items-center gap-2">
        <StepIconWithState
          type={step.type}
          size="sm"
          isCurrent={isCurrent}
          isErrored={isErrored}
          isCompleted={isCompleted}
          isPlaying={isPlaying}
          isPaused={isPaused}
        />

        <Text
          variant="small"
          color={textAndIconColor}
          className="truncate"
          title={step.name}
        >
          {step.name}
        </Text>
      </div>
    </Card>
  );
};
