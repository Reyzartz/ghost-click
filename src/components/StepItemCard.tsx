import { MacroStep } from "@/models";
import { clsx } from "clsx";
import { forwardRef, useMemo } from "react";
import { StepMeta } from "./StepMeta";
import StepIconWithState from "./StepIconWithState";
import { Dropdown, DropdownItem } from "@/design-system/Dropdown";
import { Undo2, MoreVertical } from "lucide-react";
import { Text, Button, Badge, Card } from "@/design-system";
import { cva } from "class-variance-authority";

const stepContentVariants = cva(
  "mx-auto flex flex-1 items-start gap-2 overflow-hidden transition-all duration-200 delay-200",
  {
    variants: {
      isDeleted: {
        true: "pr-20 opacity-50",
        false: "opacity-100",
      },
    },
    defaultVariants: {
      isDeleted: false,
    },
  }
);

interface StepItemCardProps {
  step: MacroStep;
  isDeleted?: boolean;
  isNew?: boolean;
  isDisabled?: boolean;
  isCurrent?: boolean;
  isCompleted?: boolean;
  isErrored?: boolean;
  isPlaying?: boolean;
  isPaused?: boolean;
  dropdownItems?: DropdownItem[];
  onClick?: () => void;
  onUndoDelete?: (stepId: string) => void;
}

export const StepItemCard = forwardRef<HTMLLIElement, StepItemCardProps>(
  (
    {
      step,
      isDeleted = false,
      isNew = false,
      isDisabled = false,
      isCurrent = false,
      isCompleted = false,
      isErrored = false,
      isPlaying = false,
      isPaused = false,
      dropdownItems = [],
      onClick,
      onUndoDelete,
    },
    ref
  ) => {
    const cardVariant = useMemo(() => {
      if (isDeleted) return "deleted";
      if (isErrored) return "errored";
      if (isCurrent) return "selected";
      if (isCompleted) return "success";
      return "default";
    }, [isDeleted, isErrored, isCurrent, isCompleted]);

    const textColor = useMemo(() => {
      if (isDeleted) return "muted";
      if (isErrored) return "error";
      if (isCurrent) return "info";
      if (isCompleted) return "success";
      return "default";
    }, [isDeleted, isErrored, isCurrent, isCompleted]);

    return (
      <Card
        as="li"
        ref={ref}
        variant={cardVariant}
        size="md"
        onClick={onClick}
        autoScroll={isCurrent}
        disabled={isDisabled}
        className="group/step relative flex w-full max-w-full items-center"
      >
        <div className={stepContentVariants({ isDeleted })}>
          <div className="flex min-w-0 flex-1 grow flex-col gap-px">
            <div className="flex items-center gap-1.5">
              <Text
                variant="small"
                className={clsx(
                  "mb-0.5 flex grow truncate",
                  isDeleted && "line-through"
                )}
                color={textColor}
              >
                <StepIconWithState
                  type={step.type}
                  size="sm"
                  isCurrent={isCurrent}
                  isErrored={isErrored}
                  isCompleted={isCompleted}
                  isPlaying={isPlaying}
                  isPaused={isPaused}
                  isDeleted={isDeleted}
                  className="mt-0.5 mr-2"
                />
                {step.name}
              </Text>

              {isNew && !isDeleted && (
                <Badge
                  variant="success"
                  className="absolute top-1 right-1 group-hover/step:hidden"
                >
                  New
                </Badge>
              )}
            </div>

            <StepMeta step={step} className="ml-6" />
          </div>
        </div>

        {isDeleted && onUndoDelete && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onUndoDelete(step.id);
            }}
            variant="ghost"
            color="secondary"
            size="sm"
            icon={Undo2}
            className="absolute top-0 right-0"
          >
            Undo
          </Button>
        )}

        {dropdownItems.length > 0 && !isPlaying && (
          <div className="-mr-1 hidden group-hover/step:inline-flex focus-within:inline-flex">
            <Dropdown
              items={dropdownItems}
              trigger={
                <Button
                  icon={MoreVertical}
                  size="sm"
                  variant="ghost"
                  color="secondary"
                  title="Step options"
                />
              }
            />
          </div>
        )}
      </Card>
    );
  }
);
