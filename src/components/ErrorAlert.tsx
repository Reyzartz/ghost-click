interface ErrorAlertProps {
  message: string;
  simple?: boolean;
}

export const ErrorAlert = ({ message, simple = false }: ErrorAlertProps) => {
  if (simple) {
    return (
      <div className="rounded border border-red-200 bg-red-50 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-red-600 text-base">⚠</span>
          <span className="text-red-800">{message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800">
      {message}
    </div>
  );
};
