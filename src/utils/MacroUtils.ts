import {
  BaseMacroStep,
  MacroStep,
  NavigateStep,
  StepType,
} from "@/models/MacroStep";
import { Settings, DEFAULT_SETTINGS } from "@/models/Settings";
import * as yup from "yup";

class MacroUtils {
  static DEFAULT_MACRO_NAME_PREFIX = "Untitled Macro ";

  // Validation schemas
  static readonly targetElementSelectorSchema = yup
    .object({
      id: yup.string(),
      className: yup.string(),
      xpath: yup.string(),
      defaultSelector: yup
        .string()
        .oneOf(["id", "className", "xpath"], "Invalid default selector")
        .required("Default selector is required"),
    })
    .test(
      "at-least-one-selector",
      "At least one of id, className, or xpath is required",
      (value) => !!(value?.id || value?.className || value?.xpath)
    );

  static readonly baseStepSchema = yup.object({
    name: yup
      .string()
      .required("Step name is required")
      .min(1, "Name cannot be empty")
      .max(100, "Name is too long"),
    delay: yup
      .number()
      .required("Delay is required")
      .min(0, "Delay cannot be negative")
      .max(60000, "Delay cannot exceed 60 seconds"),
    retryCount: yup
      .number()
      .required("Retry count is required")
      .min(0, "Retry count cannot be negative")
      .max(10, "Retry count cannot exceed 10"),
    retryInterval: yup
      .number()
      .required("Retry interval is required")
      .min(0, "Retry interval cannot be negative")
      .max(10000, "Retry interval cannot exceed 10 seconds"),
  });

  static readonly clickStepSchema = MacroUtils.baseStepSchema.shape({
    target:
      MacroUtils.targetElementSelectorSchema.required("Target is required"),
    clicksCount: yup
      .number()
      .required("Clicks count is required")
      .min(1, "Clicks count must be at least 1"),
  });

  static readonly inputStepSchema = MacroUtils.baseStepSchema.shape({
    target:
      MacroUtils.targetElementSelectorSchema.required("Target is required"),
    value: yup.string().required("Value is required"),
  });

  static readonly keyPressStepSchema = MacroUtils.baseStepSchema.shape({
    target:
      MacroUtils.targetElementSelectorSchema.required("Target is required"),
    key: yup.string().required("Key is required"),
    code: yup.string().required("Code is required"),
    ctrlKey: yup.boolean().required(),
    shiftKey: yup.boolean().required(),
    altKey: yup.boolean().required(),
    metaKey: yup.boolean().required(),
  });

  static readonly navigateStepSchema = MacroUtils.baseStepSchema.shape({
    url: yup.string().required("URL is required").url("Must be a valid URL"),
  });

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

  static mergeClickSteps(steps: MacroStep[]): MacroStep[] {
    const processed: MacroStep[] = [];

    let i = 0;
    while (i < steps.length) {
      const currentStep = steps[i];

      // If it's a CLICK step, look for adjacent CLICK steps with same xpath
      if (currentStep.type === "CLICK") {
        let clickCount = 1;
        let j = i + 1;

        // Count all adjacent CLICK steps with the same xpath
        while (j < steps.length && steps[j].type === "CLICK") {
          const nextStep = steps[j];
          if (
            "target" in nextStep &&
            "target" in currentStep &&
            nextStep.target.xpath === currentStep.target.xpath
          ) {
            clickCount++;
            j++;
          } else {
            break;
          }
        }

        // Add the click step with the total count
        processed.push({
          ...currentStep,
          clicksCount: clickCount,
        });
        i = j;
      } else {
        // For non-CLICK steps, add as-is
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
    if (steps.length === 0 || steps[0].type !== "NAVIGATE") return steps;

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
          clicksCount: 1,
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

  static postProcessSteps(
    steps: MacroStep[],
    initialUrl: string,
    settings: Settings = DEFAULT_SETTINGS
  ): MacroStep[] {
    if (steps.length === 0) return steps;

    let processedSteps = steps;

    processedSteps = MacroUtils.addFirstStep(
      processedSteps,
      initialUrl,
      settings
    );
    // Merge adjacent CLICK steps targeting the same element
    processedSteps = MacroUtils.mergeClickSteps(processedSteps);
    // Merge adjacent INPUT steps targeting the same element
    processedSteps = MacroUtils.mergeInputSteps(processedSteps);
    // Calculate delays between steps
    processedSteps = MacroUtils.calculateDelays(processedSteps, settings);

    return processedSteps;
  }
}

export { MacroUtils };
