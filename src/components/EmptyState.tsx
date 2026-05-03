import { Button, Text } from "@/design-system";
import { ButtonProps } from "@/design-system/Button";
import { memo } from "react";

interface IEmptyStateProps {
  emptyIcon?: React.ReactNode;
  title?: string;
  message: string;
  buttonProps?: ButtonProps;
}

const EmptyState = memo(
  ({ emptyIcon, title, message, buttonProps }: IEmptyStateProps) => (
    <div className="flex h-full w-full flex-col items-center justify-center">
      {emptyIcon && (
        <div className="bg-background-secondary text-text-muted mb-2 flex h-10 w-10 items-center justify-center rounded-full border">
          {emptyIcon}
        </div>
      )}
      {title && (
        <Text variant="h3" color="default" className="mb-0.5">
          {title}
        </Text>
      )}

      <Text variant="small" color="muted" className="w-4/5 text-center">
        {message}
      </Text>

      {buttonProps && (
        <Button variant="primary" className="mt-3" {...buttonProps} />
      )}
    </div>
  )
);

EmptyState.displayName = "EmptyState";

export { EmptyState };
