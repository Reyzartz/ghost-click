import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text,
} from "@/design-system";
import { ButtonProps } from "@/design-system/Button";
import { memo, useState } from "react";

export interface ConfirmActionButtonProps extends ButtonProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onClick?: () => void;
  onConfirm: () => void;
  onCancel?: () => void;
  isDestructiveAction?: boolean;
}

const ConfirmActionButton = memo<ConfirmActionButtonProps>(
  ({
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onClick,
    onCancel,
    onConfirm,
    isDestructiveAction,
    ...props
  }) => {
    const [open, setOpen] = useState(false);

    const onClickHandler = (): void => {
      onClick?.();
      setOpen(true);
    };

    const onCloseHandler = (): void => {
      setOpen(false);
      onCancel?.();
    };

    const onConfirmHandler = (): void => {
      onConfirm();
      setOpen(false);
    };

    return (
      <>
        <Button onClick={onClickHandler} {...props} />

        <Modal isOpen={open} maxWidth="sm">
          <ModalHeader title={title} />

          <ModalBody>
            <Text variant="body" color="muted">
              {message}
            </Text>
          </ModalBody>

          <ModalFooter className="flex-end flex gap-2">
            <Button onClick={onCloseHandler} color="secondary" variant="text">
              {cancelText}
            </Button>

            <Button
              onClick={onConfirmHandler}
              color={isDestructiveAction ? "danger" : "primary"}
            >
              {confirmText}
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
);

ConfirmActionButton.displayName = "ConfirmActionButton";

export { ConfirmActionButton };
