interface EmptyStateProps {
  message: string;
}

export const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-slate-600">
      {message}
    </div>
  );
};
