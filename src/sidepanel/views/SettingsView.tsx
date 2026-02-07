import { useEffect, useState } from "react";
import { SidePanelApp } from "../SidePanelApp";
import { SettingsState } from "../viewmodels/SettingsViewModel";
import { Text, Alert, Button, Input, Select } from "@/design-system";
import { SettingsItem } from "@/components/SettingsItem";
import { RefreshCw, Clock, Target, Gauge } from "lucide-react";
import { Layout } from "@/components/Layout";

export const SettingsView = ({ app }: { app: SidePanelApp }) => {
  const [state, setState] = useState<SettingsState>({
    loading: false,
    settings: null,
    formSettings: null,
    error: null,
    formErrors: {},
    isDirty: false,
    saving: false,
  });

  useEffect(() => {
    const unsubscribe = app.settingsViewModel.subscribe(setState);
    return () => unsubscribe();
  }, [app]);

  const handleBack = (): void => {
    if (state.isDirty) {
      if (
        !confirm("You have unsaved changes. Are you sure you want to leave?")
      ) {
        return;
      }
    }
    app.viewService.navigateToView("macroList");
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    void app.settingsViewModel.saveSettings();
  };

  const handleReset = (): void => {
    if (confirm("Are you sure you want to reset all settings to defaults?")) {
      void app.settingsViewModel.resetSettings();
    }
  };

  const handleCancel = (): void => {
    app.settingsViewModel.cancelChanges();
  };

  if (!state.formSettings) {
    return (
      <Layout header={<Layout.Header title="Settings" onBack={handleBack} />}>
        <div className="flex flex-1 items-center justify-center">
          <Text variant="body" color="muted">
            {state.loading ? "Loading settings..." : "No settings available"}
          </Text>
        </div>
      </Layout>
    );
  }

  return (
    <Layout header={<Layout.Header title="Settings" onBack={handleBack} />}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col overflow-hidden"
      >
        {/* Content */}
        <div className="flex-1 overflow-y-auto pb-4">
          {state.error && <Alert variant="error">{state.error}</Alert>}

          {/* Playback Settings Section */}

          {/* Default Retry Count */}
          <SettingsItem
            icon={RefreshCw}
            label="Retry Count"
            description="Number of attempts to find an element"
          >
            <Input
              type="number"
              size="sm"
              value={state.formSettings.defaultRetryCount}
              onChange={(e) =>
                app.settingsViewModel.updateFormField(
                  "defaultRetryCount",
                  parseInt(e.target.value, 10)
                )
              }
              min={0}
              max={10}
              error={state.formErrors.defaultRetryCount}
              className="w-20 text-center"
              fullWidth={false}
            />
          </SettingsItem>

          {/* Default Retry Interval */}
          <SettingsItem
            icon={Clock}
            label="Retry Interval"
            description="Wait time between retry attempts"
          >
            <Input
              type="number"
              size="sm"
              value={state.formSettings.defaultRetryIntervalMs}
              onChange={(e) =>
                app.settingsViewModel.updateFormField(
                  "defaultRetryIntervalMs",
                  parseInt(e.target.value, 10)
                )
              }
              min={100}
              max={10000}
              step={100}
              error={state.formErrors.defaultRetryIntervalMs}
              className="w-24 text-center"
              fullWidth={false}
            />
          </SettingsItem>

          {/* Default Selector Type */}
          <SettingsItem
            icon={Target}
            label="Selector Type"
            description="Method used to identify elements"
          >
            <Select
              value={state.formSettings.defaultSelectorType}
              size="sm"
              onChange={(e) =>
                app.settingsViewModel.updateFormField(
                  "defaultSelectorType",
                  e.target.value
                )
              }
              error={state.formErrors.defaultSelectorType}
              className="w-32"
              fullWidth={false}
            >
              <option value="xpath">XPath</option>
              <option value="id">ID</option>
              <option value="className">Class Name</option>
            </Select>
          </SettingsItem>

          {/* Minimum Delay */}
          <SettingsItem
            icon={Gauge}
            label="Minimum Delay"
            description="Minimum time between macro steps"
          >
            <Input
              type="number"
              size="sm"
              value={state.formSettings.minimumDelayMs}
              onChange={(e) =>
                app.settingsViewModel.updateFormField(
                  "minimumDelayMs",
                  parseInt(e.target.value, 10)
                )
              }
              min={0}
              max={5000}
              step={50}
              error={state.formErrors.minimumDelayMs}
              className="w-24 text-center"
              fullWidth={false}
            />
          </SettingsItem>

          <Button
            type="button"
            variant="danger"
            onClick={handleReset}
            disabled={state.saving}
            fullWidth
            className="mt-6"
          >
            Reset to Defaults
          </Button>
        </div>

        {/* Sticky Bottom Actions */}
        {state.isDirty && (
          <div className="py-3">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                disabled={state.saving}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={
                  state.saving || app.settingsViewModel.hasValidationErrors()
                }
                fullWidth
              >
                {state.saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        )}
      </form>
    </Layout>
  );
};
