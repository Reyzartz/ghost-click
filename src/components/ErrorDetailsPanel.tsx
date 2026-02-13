import { useState } from "react";
import { clsx } from "clsx";
import { AlertTriangle, ChevronDown, ChevronRight } from "lucide-react";
import { StepError } from "@/sidepanel/viewmodels/PlaybackProgressViewModel";
import { Text, Icon } from "@/design-system";

interface ErrorDetailsPanelProps {
  errorMessage: string;
  errorDetails: StepError[];
}

export const ErrorDetailsPanel = ({
  errorMessage,
  errorDetails,
}: ErrorDetailsPanelProps) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="border-error-border bg-error-bg shrink-0 overflow-hidden rounded border">
      <div
        className="hover:bg-error-bg-hover flex cursor-pointer items-center justify-between px-3 py-2"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center gap-2">
          <Icon icon={AlertTriangle} size="sm" color="error" />
          <Text variant="small" className="text-error-text font-medium">
            {errorMessage}
          </Text>
        </div>
        <div className="text-error-icon flex items-center gap-1">
          {showDetails ? (
            <Icon icon={ChevronDown} size="xs" />
          ) : (
            <Icon icon={ChevronRight} size="xs" />
          )}
          <Text variant="small" color="error">
            Details
          </Text>
        </div>
      </div>

      <div
        className={clsx(
          "border-error-border bg-error-bg overflow-auto transition-[max-height] duration-300",
          showDetails ? "max-h-48 border-t" : "max-h-0"
        )}
      >
        <ul className="divide-error-border divide-y">
          {errorDetails.map((err, idx) => (
            <li key={idx} className="px-3 py-2">
              <div className="flex items-start gap-2">
                <Text variant="small" color="error" className="mt-0.5">
                  •
                </Text>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Text
                      variant="small"
                      className="text-error-text font-medium"
                    >
                      {err.stepName}
                    </Text>
                    <Text
                      variant="small"
                      color="error"
                      className="bg-error-bg-hover rounded px-1.5 py-0.5"
                    >
                      {err.stepType}
                    </Text>
                  </div>
                  <Text
                    variant="small"
                    color="error"
                    className="mt-1 wrap-break-word"
                  >
                    {err.error}
                  </Text>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
