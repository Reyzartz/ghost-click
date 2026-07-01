import { MacroStep } from "@/models";
import { clsx } from "clsx";
import { CSSProperties, forwardRef, useMemo } from "react";
import { StepMeta } from "./StepMeta";
import StepIconWithState from "./StepIconWithState";
import { Dropdown, DropdownItem } from "@/design-system/Dropdown";
import { Undo2, MoreVertical, GripVertical } from "lucide-react";
import { Text, Button, Badge, Card } from "@/design-system";
import { cva } from "class-variance-authority";
import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from "@dnd-kit/core";

export interface DragHandleProps {
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners;
}

const stepContentVariants = cva(
  "mx-auto flex flex-1 items-center gap-2 overflow-hidden transition-all duration-200 delay-200",
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
  style?: CSSProperties;
  dragHandleProps?: DragHandleProps;
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
      style,
      dragHandleProps,
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
        style={style}
        className="group/step relative flex w-full max-w-full items-center pl-1"
      >
        {dragHandleProps && (
          <Button
            icon={GripVertical}
            size="sm"
            variant="ghost"
            color="secondary"
            disabled={isDisabled}
            title="Drag to reorder"
            className="shrink-0 cursor-grab touch-none active:cursor-grabbing"
            {...dragHandleProps.attributes}
            {...dragHandleProps.listeners}
          />
        )}

        <div className={stepContentVariants({ isDeleted })}>
          <StepIconWithState
            type={step.type}
            size="sm"
            isCurrent={isCurrent}
            isErrored={isErrored}
            isCompleted={isCompleted}
            isPlaying={isPlaying}
            isPaused={isPaused}
            isDeleted={isDeleted}
            filled
          />

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

            <StepMeta step={step} />
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
          <Dropdown
            items={dropdownItems}
            trigger={
              <Button
                icon={MoreVertical}
                size="sm"
                variant="ghost"
                color="secondary"
                title="Step options"
                className="-mr-1 opacity-0 group-hover/step:opacity-100 focus-within:opacity-100"
              />
            }
          />
        )}
      </Card>
    );
  }
);
