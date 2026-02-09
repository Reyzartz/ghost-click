import {
  BaseMacroStep,
  MacroStep,
  NavigateStep,
  StepType,
} from "@/models/MacroStep";
import { Settings, DEFAULT_SETTINGS } from "@/models/Settings";

class MacroUtils {
  static DEFAULT_MACRO_NAME_PREFIX = "Untitled Macro ";

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

  static addFirstStep(
    steps: MacroStep[],
    initialUrl: string,
    settings: Settings = DEFAULT_SETTINGS
  ): MacroStep[] {
    if (steps.length === 0) return steps;

    const initalStep: NavigateStep = {
      id: MacroUtils.generateStepId(),
      name: MacroUtils.getStepName(initialUrl, "NAVIGATE"),
      type: "NAVIGATE",
      url: initialUrl,
      timestamp: steps[0].timestamp - settings.minimumDelayMs,
      delay: 0, // Will be calculated in post-processing
      retryCount: settings.defaultRetryCount,
      retryInterval: settings.defaultRetryIntervalMs,
    };

    return [initalStep, ...steps];
  }

  static calculateDelays(
    steps: MacroStep[],
    settings: Settings = DEFAULT_SETTINGS
  ): MacroStep[] {
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
          : settings.minimumDelayMs;

      return {
        ...step,
        delay: Math.max(0, delay), // Ensure non-negative delay
      };
    });
  }

  static createEmptyStep = (
    type: StepType,
    settings: Settings = DEFAULT_SETTINGS
  ): MacroStep => {
    const baseStep: BaseMacroStep = {
      id: MacroUtils.generateStepId(),
      name: MacroUtils.getStepName("<unknown>", type),
      type,
      // TODO: this filed will remove in the future, need to update all related code
      timestamp: Date.now(),
      delay: settings.minimumDelayMs,
      retryCount: settings.defaultRetryCount,
      retryInterval: settings.defaultRetryIntervalMs,
    };

    const defaultTarget = {
      id: "",
      className: "",
      xpath: "",
      defaultSelector: settings.defaultSelectorType,
    };

    switch (type) {
      case "CLICK":
        return {
          ...baseStep,
          target: defaultTarget,
          type: "CLICK",
        };
      case "INPUT":
        return {
          ...baseStep,
          target: defaultTarget,
          type: "INPUT",
          value: "",
        };
      case "KEYPRESS":
        return {
          ...baseStep,
          type: "KEYPRESS",
          key: "",
          code: "",
          ctrlKey: false,
          shiftKey: false,
          altKey: false,
          metaKey: false,
          target: defaultTarget,
        };
      case "NAVIGATE":
        return {
          ...baseStep,
          type: "NAVIGATE",
          url: "",
        };
    }
  };
}

export { MacroUtils };
