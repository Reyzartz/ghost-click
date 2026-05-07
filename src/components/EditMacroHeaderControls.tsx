import { Button } from "@/design-system";
import { ConfirmActionButton } from "@/components/ConfirmActionButton";
import { Play, Pause, Square, Trash2 } from "lucide-react";
import { Macro } from "@/models";

interface EditMacroHeaderControlsProps {
  macro: Macro | null;
  isPlaying: boolean;
  isPaused: boolean;
  isCreating: boolean;
  onPlayPreview: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onDelete?: () => void;
}

export const EditMacroHeaderControls = ({
  macro,
  isPlaying,
  isPaused,
  isCreating,
  onPlayPreview,
  onPause,
  onResume,
  onStop,
  onDelete,
}: EditMacroHeaderControlsProps) => {
  return (
    <div className="flex shrink-0 items-start gap-1">
      {isPlaying ? (
        <>
          {isPaused ? (
            <Button
              variant="outlined"
              color="secondary"
              size="sm"
              onClick={onResume}
              icon={Play}
              title={"Resume Playback"}
            />
          ) : (
            <Button
              variant="outlined"
              color="primary"
              size="sm"
              onClick={onPause}
              icon={Pause}
              title={"Pause Playback"}
            />
          )}
          <Button
            color="danger"
            variant="ghost"
            size="sm"
            onClick={onStop}
            icon={Square}
            title={"Stop Playback"}
          />
        </>
      ) : (
        <>
          <Button
            onClick={onPlayPreview}
            size="sm"
            icon={Play}
            disabled={!macro?.name.trim() || (macro?.steps?.length ?? 0) === 0}
            title={"Test Run Macro"}
            variant="ghost"
            color="primary"
          />

          {!isCreating && onDelete && (
            <ConfirmActionButton
              color="danger"
              variant="ghost"
              size="sm"
              icon={Trash2}
              message="Are you sure you want to delete this macro? This action cannot be undone."
              confirmText="Delete"
              isDestructiveAction
              onConfirm={onDelete}
              title={"Delete Macro"}
            />
          )}
        </>
      )}
    </div>
  );
};

export default EditMacroHeaderControls;
