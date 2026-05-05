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

interface ConfirmActionModalProps extends ButtonProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onClick?: () => void;
  onConfirm: () => void;
  onCancel?: () => void;
}

const ConfirmActionButton = memo<ConfirmActionModalProps>(
  ({
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onClick,
    onCancel,
    onConfirm,
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
            <Text variant="body">{message}</Text>
          </ModalBody>
          <ModalFooter className="flex gap-2">
            <Button onClick={onCloseHandler} variant="secondary" fullWidth>
              {cancelText}
            </Button>
            <Button
              onClick={onConfirmHandler}
              variant={props.variant === "danger" ? "danger" : "primary"}
              fullWidth
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
