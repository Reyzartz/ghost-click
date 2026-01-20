import { Alert } from "@/design-system";

interface ErrorAlertProps {
  message: string;
  simple?: boolean;
}

export const ErrorAlert = ({ message, simple = false }: ErrorAlertProps) => {
  if (simple) {
    return <Alert variant="error">{message}</Alert>;
  }

  return <Alert variant="warning">{message}</Alert>;
};
