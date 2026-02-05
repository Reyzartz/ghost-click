import { MacroStep, NavigateStep, StepType } from "@/models/MacroStep";

class MacroUtils {
  static DEFAULT_MACRO_NAME_PREFIX = "Untitled Macro ";
  static DEFAULT_RETRY_COUNT = 3;
  static DEFAULT_RETRY_INTERVAL_MS = 1000;
  static DEFAULT_SELECTOR_TYPE = "xpath" as const;
  static MINIMUM_DELAY_MS = 200;

  static extractDomainFromURL(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return "unknown";
    }
  }

  static getFaviconFromURL(url: string): string {
    try {
      const urlObj = new URL(`${url.includes("://") ? "" : "https://"}${url}`);
      return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
    } catch {
      return "";
    }
  }

  static getDefaultMacroName(): string {
    return `${this.DEFAULT_MACRO_NAME_PREFIX}${new Date().toLocaleString()}`;
  }

  static generateMacroId(): string {
    return crypto.randomUUID();
  }

  static generateStepId(): string {
    return crypto.randomUUID();
  }

  static generateSessionId(): string {
    return crypto.randomUUID();
  }

  static getStepName(name: string, type: StepType): string {
    let displayName = "";
    switch (type) {
      case "CLICK":
        displayName = `Clicked "${name}"`;
        break;
      case "INPUT":
        displayName = `Typed "${name}"`;
        break;
      case "KEYPRESS":
        displayName = `Pressed "${name}"`;
        break;
      case "NAVIGATE":
        displayName = `Go to "${name}"`;
        break;
    }
    return displayName.length > 30
      ? `${displayName.substring(0, 47)}..."`
      : displayName;
  }

  static mergeInputSteps(steps: MacroStep[]): MacroStep[] {
    const processed: MacroStep[] = [];

    let i = 0;
    while (i < steps.length) {
      const currentStep = steps[i];

      // If it's an INPUT step, look for adjacent INPUT steps with same xpath
      if (currentStep.type === "INPUT") {
        let lastInputStep = currentStep;
        let j = i + 1;

        // Find all adjacent INPUT steps with the same xpath
        while (j < steps.length && steps[j].type === "INPUT") {
          const nextStep = steps[j];
          if (
            "target" in nextStep &&
            "target" in currentStep &&
            nextStep.target.xpath === currentStep.target.xpath
          ) {
            lastInputStep = nextStep as typeof currentStep;
            j++;
          } else {
            break;
          }
        }

        // Add only the last input step (which has the final value)
        processed.push(lastInputStep);
        i = j;
      } else {
        // For non-INPUT steps, add as-is
        processed.push(currentStep);
        i++;
      }
    }

    return processed;
  }

  static addFirstStep(steps: MacroStep[], initialUrl: string): MacroStep[] {
    if (steps.length === 0) return steps;

    const initalStep: NavigateStep = {
      id: MacroUtils.generateStepId(),
      name: MacroUtils.getStepName(initialUrl, "NAVIGATE"),
      type: "NAVIGATE",
      url: initialUrl,
      timestamp: steps[0].timestamp - MacroUtils.MINIMUM_DELAY_MS,
      delay: 0, // Will be calculated in post-processing
      retryCount: MacroUtils.DEFAULT_RETRY_COUNT,
      retryInterval: MacroUtils.DEFAULT_RETRY_INTERVAL_MS,
    };

    return [initalStep, ...steps];
  }

  static calculateDelays(steps: MacroStep[]): MacroStep[] {
    if (steps.length === 0) return steps;

    return steps.map((step, index) => {
      // Calculate delay to next step (0 for last step)

      const currentTimestamp = step.timestamp;
      const nextTimestamp =
        index < steps.length - 1
          ? steps[index + 1].timestamp
          : currentTimestamp;
      const delay =
        nextTimestamp !== null && currentTimestamp !== null
          ? nextTimestamp - currentTimestamp
          : MacroUtils.MINIMUM_DELAY_MS;

      return {
        ...step,
        delay: Math.max(0, delay), // Ensure non-negative delay
      };
    });
  }
}

export { MacroUtils };
