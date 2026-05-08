import { useEffect, useState } from "react";
import { SidePanelApp } from "../SidePanelApp";
import { SettingsState } from "../viewmodels/SettingsViewModel";
import { Text, Alert, Button, Input, Select, Toggle } from "@/design-system";
import { SettingsSection } from "@/components/SettingsSection";
import { SettingsCard } from "@/components/SettingsCard";
import {
  RefreshCw,
  Clock,
  Palette,
  Timer,
  CircleX,
  RotateCw,
  Target,
} from "lucide-react";
import { Layout } from "@/design-system/Layout";
import clsx from "clsx";

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
    app.settingsViewModel.cancelChanges();
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

  const canUpdate = () => {
    return (
      !app.settingsViewModel.hasValidationErrors() &&
      state.isDirty &&
      !state.saving
    );
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
    <Layout
      header={
        <Layout.Header title="Settings" onBack={handleBack}>
          <Button
            onClick={handleSubmit}
            size="sm"
            className={clsx(
              "transition-transform duration-200 ease-in-out",
              canUpdate() ? "translate-y-0" : "-translate-y-full"
            )}
          >
            {state.saving ? "Saving..." : "Update"}
          </Button>
        </Layout.Header>
      }
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col gap-4 overflow-y-auto"
      >
        {state.error && <Alert variant="error">{state.error}</Alert>}

        <SettingsSection title="Playback">
          <SettingsCard
            label="Stop on error"
            description="Abort on first failure"
            icon={CircleX}
          >
            <Toggle
              checked={state.formSettings.stopOnError}
              onChange={(e) =>
                app.settingsViewModel.updateFormField(
                  "stopOnError",
                  e.target.checked
                )
              }
            />
          </SettingsCard>
        </SettingsSection>

        <SettingsSection title="Recording">
          <SettingsCard
            label="Refresh page"
            description="Reload before recording starts"
            icon={RotateCw}
          >
            <Toggle
              checked={state.formSettings.refreshPageOnRecording}
              onChange={(e) =>
                app.settingsViewModel.updateFormField(
                  "refreshPageOnRecording",
                  e.target.checked
                )
              }
            />
          </SettingsCard>

          {/* 2-column inputs */}
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              label="Min Retry count"
              info="Times to retry finding elements before marking a step as failed"
              value={state.formSettings.defaultRetryCount}
              onChange={(e) =>
                app.settingsViewModel.updateFormField(
                  "defaultRetryCount",
                  parseInt(e.target.value, 10)
                )
              }
              min={0}
              max={10}
              icon={RefreshCw}
              error={state.formErrors.defaultRetryCount}
              fullWidth
            />

            <Input
              type="number"
              label="Min delay (ms)"
              info="Minimum milliseconds to wait between macro steps during playback"
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
              icon={Clock}
              error={state.formErrors.minimumDelayMs}
              fullWidth
            />
          </div>

          <Input
            type="number"
            label="Retry interval (ms)"
            info="Milliseconds to wait between retry attempts when an element is not found"
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
            icon={Timer}
            error={state.formErrors.defaultRetryIntervalMs}
            fullWidth
          />

          <Select
            label="Default Selector"
            info="Strategy used to identify elements on the page (XPath is most reliable, ID is fastest)"
            icon={Target}
            value={state.formSettings.defaultSelectorType}
            onChange={(e) =>
              app.settingsViewModel.updateFormField(
                "defaultSelectorType",
                e.target.value
              )
            }
            error={state.formErrors.defaultSelectorType}
            fullWidth
          >
            <option value="xpath">XPath</option>
            <option value="id">ID</option>
            <option value="className">Classname</option>
          </Select>
        </SettingsSection>

        <SettingsSection title="Appearance">
          <Select
            icon={Palette}
            value={state.formSettings.theme as string}
            onChange={(e) =>
              app.settingsViewModel.updateFormField("theme", e.target.value)
            }
            error={state.formErrors.theme}
            fullWidth
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </Select>
        </SettingsSection>

        <Alert variant="info" className="-mt-2">
          Shortcuts: Alt+Q record · Alt+W stop · Alt+S sidepanel
        </Alert>

        <Button
          type="button"
          color="danger"
          variant="ghost"
          onClick={handleReset}
          disabled={state.saving}
          fullWidth
          className="mt-auto"
        >
          Reset to Defaults
        </Button>
      </form>
    </Layout>
  );
};
