import { useState } from "react";
import { clsx } from "clsx";
import { AlertTriangle, ChevronDown, ChevronRight } from "lucide-react";
import { StepError } from "@/sidepanel/viewmodels/PlaybackProgressViewModel";
import { Text } from "@/design-system";

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
    <div className="shrink-0 overflow-hidden rounded border border-red-300 bg-red-50">
      <div
        className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-red-100"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-600" />
          <Text variant="small" className="font-medium text-red-900">
            {errorMessage}
          </Text>
        </div>
        <div className="flex items-center gap-1 text-red-600">
          {showDetails ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          <Text variant="small" color="error">
            Details
          </Text>
        </div>
      </div>

      <div
        className={clsx(
          "overflow-auto border-red-200 bg-red-50 transition-[max-height] duration-300",
          showDetails ? "max-h-48 border-t" : "max-h-0"
        )}
      >
        <ul className="divide-y divide-red-200">
          {errorDetails.map((err, idx) => (
            <li key={idx} className="px-3 py-2">
              <div className="flex items-start gap-2">
                <Text variant="small" color="error" className="mt-0.5">
                  •
                </Text>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Text variant="small" className="font-medium text-red-900">
                      {err.stepName}
                    </Text>
                    <Text
                      variant="small"
                      color="error"
                      className="rounded bg-red-100 px-1.5 py-0.5"
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
