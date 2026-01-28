import { useEffect, useState } from "react";
import { SidePanelApp } from "./SidePanelApp";
import { ViewState } from "./services/ViewService";
import { MacroListView } from "./views/MacroListView";
import { PlaybackProgressView } from "./views/PlaybackProgressView";
import { EditMacroView } from "./views/EditMacroView";
import { ImportMacroModal } from "./views/ImportMacroModal";

// Main App component that controls view switching
export default function App({ app }: { app: SidePanelApp }) {
  const [viewState, setViewState] = useState<ViewState>({
    currentView: "macroList",
  });

  useEffect(() => {
    const unsubscribe = app.viewService.subscribe(setViewState);
    return () => unsubscribe();
  }, [app]);

  return (
    <div className="flex h-screen min-h-screen flex-col bg-white">
      {viewState.currentView === "macroList" && <MacroListView app={app} />}
      {viewState.currentView === "playbackProgress" && (
        <PlaybackProgressView app={app} />
      )}
      {viewState.currentView === "editMacro" && <EditMacroView app={app} />}
      <ImportMacroModal app={app} />
    </div>
  );
}
