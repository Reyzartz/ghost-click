import React from "react";
import { Button } from "@/design-system";

type Props = {
  isDirty: boolean;
  saving: boolean;
  onCancel: () => void;
  hasValidationErrors?: boolean;
};

export const SettingsActions = ({
  isDirty,
  saving,
  onCancel,
  hasValidationErrors,
}: Props) => {
  if (!isDirty) return null;

  return (
    <div className="py-3">
      <div className="flex gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={saving}
          fullWidth
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={saving || !!hasValidationErrors}
          fullWidth
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default SettingsActions;
