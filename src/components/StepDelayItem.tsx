interface StepDelayItemProps {
  delay: number;
}

export const StepDelayItem = ({ delay }: StepDelayItemProps) => {
  if (delay === 0) return null;

  return (
    <div className="flex justify-center py-1 group-last:hidden">
      <div className="rounded border border-slate-300 bg-slate-50 px-3 py-1 text-xs text-slate-600">
        {delay}ms
      </div>
    </div>
  );
};
