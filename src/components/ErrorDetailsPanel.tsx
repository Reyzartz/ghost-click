import { useState } from "react";
import { StepError } from "@/sidepanel/viewmodels/PlaybackProgressViewModel";

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
    <div className="rounded border border-red-300 bg-red-50 overflow-hidden">
      <div
        className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-red-100"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center gap-2">
          <span className="text-red-600 text-base">⚠</span>
          <span className="text-red-900 font-medium">{errorMessage}</span>
        </div>
        <span className="text-red-600 text-xs">
          {showDetails ? "▼" : "▶"} Details
        </span>
      </div>
      {showDetails && (
        <div className="border-t border-red-200 bg-red-50 overflow-auto max-h-48">
          <ul className="divide-y divide-red-200">
            {errorDetails.map((err, idx) => (
              <li key={idx} className="px-3 py-2">
                <div className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">•</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-red-900 text-xs">
                        {err.stepName}
                      </span>
                      <span className="text-red-600 text-xs px-1.5 py-0.5 rounded bg-red-100">
                        {err.stepType}
                      </span>
                    </div>
                    <p className="text-xs text-red-800 mt-1 wrap-break-word">
                      {err.error}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
