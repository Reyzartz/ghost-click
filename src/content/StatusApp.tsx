import { useState, useEffect } from "react";
import { cva } from "class-variance-authority";
import { ContentApp } from "./ContentApp";

const statusContainer = cva(
  "pointer-events-none fixed inset-0 box-border h-screen w-screen rounded-none",
  {
    variants: {
      status: {
        idle: "",
        recording:
          "border-solid border-2 border-error/50 [box-shadow:inset_0_0_80px_color-mix(in_oklch,var(--color-error)_35%,transparent)]",
        playing:
          "border-solid border-2 border-success/50 [box-shadow:inset_0_0_80px_color-mix(in_oklch,var(--color-success)_35%,transparent)]",
        paused:
          "border-solid border-2 border-info/50 [box-shadow:inset_0_0_80px_color-mix(in_oklch,var(--color-info)_35%,transparent)]",
      },
    },
    defaultVariants: { status: "idle" },
  }
);

function StatusApp({ app }: { app: ContentApp }) {
  const [statusState, setStatusState] = useState({ status: "idle" as const });

  useEffect(() => {
    const unsubscribe = app.statusIndicatorViewModel.subscribe(setStatusState);
    return () => unsubscribe();
  }, [app]);

  return (
    <div
      style={{ zIndex: 9999 }}
      className={statusContainer({ status: statusState.status })}
    />
  );
}

export default StatusApp;
