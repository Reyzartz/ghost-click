import { useEffect, useState } from "react";
import { SidePanelApp } from "../SidePanelApp";
import { SettingsState } from "../viewmodels/SettingsViewModel";
import { Text } from "@/design-system";
import { Layout } from "@/components/Layout";

export const SettingsView = ({ app }: { app: SidePanelApp }) => {
  const [_state, setState] = useState<SettingsState>({
    loading: false,
  });

  useEffect(() => {
    const unsubscribe = app.settingsViewModel.subscribe(setState);
    return () => unsubscribe();
  }, [app]);

  const handleBack = (): void => {
    app.viewService.navigateToView("macroList");
  };

  return (
    <Layout
      header={<Layout.Header title="Settings" onBack={handleBack} showBorder />}
    >
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Settings will be added here */}
          <div className="py-12 text-center text-gray-500">
            <Text variant="body">No settings configured yet.</Text>
          </div>
        </div>
      </div>
    </Layout>
  );
};
