import { useState, useEffect } from "react";
import { ContentApp } from "../ContentApp";
import {
  AppStatus,
  StatusIndicatorState,
} from "../viewmodels/StatusIndicatorViewModel";

const statusStyles: Record<AppStatus, string> = {
  idle: "",
  recording: "border-solid border-4 border-red-500",
  playing: "border-solid border-4 border-green-500",
};

function App({ app }: { app: ContentApp }) {
  const [statusState, setStatusState] = useState<StatusIndicatorState>({
    status: "idle",
  });

  useEffect(() => {
    const unsubscribe = app.statusIndicatorViewModel.subscribe(setStatusState);
    return () => unsubscribe();
  }, [app]);

  return (
    <div
      style={{
        zIndex: 9999,
      }}
      className={`fixed inset-0 box-border  pointer-events-none w-screen h-screen ${
        statusStyles[statusState.status]
      }`}
    />
  );
}

export default App;
