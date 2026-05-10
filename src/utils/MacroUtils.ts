import { Macro } from "@/models/Macro";
import {
  BaseMacroStep,
  ClickStep,
  InputStep,
  KeyPressStep,
  MacroStep,
  NavigateStep,
  StepType,
  TargetElementSelector,
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

  static readonly stepsSchema = yup
    .array()
    .of(
      yup.lazy((value: unknown): yup.AnyObjectSchema => {
        const type = (value as { type?: string })?.type;
        switch (type) {
          case "CLICK":
            return MacroUtils.clickStepSchema as yup.AnyObjectSchema;
          case "INPUT":
            return MacroUtils.inputStepSchema as yup.AnyObjectSchema;
          case "KEYPRESS":
            return MacroUtils.keyPressStepSchema as yup.AnyObjectSchema;
          case "NAVIGATE":
            return MacroUtils.navigateStepSchema as yup.AnyObjectSchema;
          default:
            return yup.object({
              type: yup
                .string()
                .oneOf(
                  ["CLICK", "INPUT", "KEYPRESS", "NAVIGATE"],
                  `Unknown step type: "${String(type)}"`
                )
                .required("Step type is required"),
            });
        }
      })
    )
    .test("unique-step-ids", "Step IDs must be unique", function (steps) {
      if (!steps) return true;
      const seen = new Set<string>();
      const dups = new Set<string>();
      for (const step of steps) {
        const id = (step as { id?: string })?.id;
        if (id) {
          if (seen.has(id)) dups.add(id);
          seen.add(id);
        }
      }
      if (dups.size === 0) return true;
      return this.createError({
        message: `Duplicate step ID${dups.size > 1 ? "s" : ""}: ${[...dups].join(", ")}`,
      });
    })
    .required();

  static readonly macroSchema = yup.object({
    id: yup.string().required("id is required"),
    name: yup
      .string()
      .required("name is required")
      .min(1, "name cannot be empty")
      .max(100, "name is too long"),
    domain: yup.string().required("domain is required"),
    faviconUrl: yup.string().nullable().defined(),
    steps: yup
      .array()
      .of(
        yup.lazy((value: unknown): yup.AnyObjectSchema => {
          const type = (value as { type?: string })?.type;
          switch (type) {
            case "CLICK":
              return MacroUtils.clickStepSchema as yup.AnyObjectSchema;
            case "INPUT":
              return MacroUtils.inputStepSchema as yup.AnyObjectSchema;
            case "KEYPRESS":
              return MacroUtils.keyPressStepSchema as yup.AnyObjectSchema;
            case "NAVIGATE":
              return MacroUtils.navigateStepSchema as yup.AnyObjectSchema;
            default:
              return yup.object({
                type: yup
                  .string()
                  .oneOf(
                    ["CLICK", "INPUT", "KEYPRESS", "NAVIGATE"],
                    `Unknown step type: "${String(type)}"`
                  )
                  .required("Step type is required"),
              });
          }
        })
      )
      .required("steps is required"),
    createdAt: yup.number().required("createdAt is required"),
    updatedAt: yup.number().required("updatedAt is required"),
    lastPlayedAt: yup.number().nullable().defined(),
    pinned: yup.boolean().required("pinned is required"),
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

  static createBaseStep(
    type: StepType,
    settings: Settings = DEFAULT_SETTINGS,
    data: Partial<BaseMacroStep> = {}
  ): BaseMacroStep {
    return {
      id: MacroUtils.generateStepId(),
      name: MacroUtils.getStepName("<unknown>", type),
      type,
      timestamp: Date.now(),
      delay: settings.minimumDelayMs,
      retryCount: settings.defaultRetryCount,
      retryInterval: settings.defaultRetryIntervalMs,
      ...data,
    };
  }

  static createDefaultTarget(
    settings: Settings,
    target: Partial<TargetElementSelector> = {}
  ): TargetElementSelector {
    return {
      id: "",
      className: "",
      xpath: "",
      defaultSelector: settings.defaultSelectorType,
      ...target,
    };
  }

  static createClickStep(
    settings: Settings = DEFAULT_SETTINGS,
    data: Partial<ClickStep> = {}
  ): ClickStep {
    const baseStep: BaseMacroStep = MacroUtils.createBaseStep(
      "CLICK",
      settings
    );

    const defaultTarget = MacroUtils.createDefaultTarget(settings);

    return {
      ...baseStep,
      target: defaultTarget,
      type: "CLICK",
      clicksCount: 1,
      ...data,
    };
  }

  static createInputStep(
    settings: Settings = DEFAULT_SETTINGS,
    data: Partial<InputStep> = {}
  ): InputStep {
    const baseStep: BaseMacroStep = MacroUtils.createBaseStep(
      "INPUT",
      settings
    );

    const defaultTarget = MacroUtils.createDefaultTarget(settings);

    return {
      ...baseStep,
      target: defaultTarget,
      type: "INPUT",
      value: "",
      ...data,
    };
  }

  static createKeyPressStep(
    settings: Settings = DEFAULT_SETTINGS,
    data: Partial<KeyPressStep> = {}
  ): KeyPressStep {
    const baseStep: BaseMacroStep = MacroUtils.createBaseStep(
      "KEYPRESS",
      settings
    );

    const defaultTarget = MacroUtils.createDefaultTarget(settings);

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
      ...data,
    };
  }

  static createNavigateStep(
    settings: Settings = DEFAULT_SETTINGS,
    data: Partial<NavigateStep> = {}
  ): NavigateStep {
    const baseStep: BaseMacroStep = MacroUtils.createBaseStep(
      "NAVIGATE",
      settings
    );

    return {
      ...baseStep,
      type: "NAVIGATE",
      url: "",
      ...data,
    };
  }

  static createInitialMacro(macro: Partial<Macro> = {}): Macro {
    return {
      id: crypto.randomUUID(),
      name: MacroUtils.getDefaultMacroName(),
      domain: "",
      faviconUrl: "",
      steps: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      lastPlayedAt: null,
      pinned: false,
      ...macro,
    };
  }

  static optimizeSteps(
    steps: MacroStep[],
    settings: Settings = DEFAULT_SETTINGS
  ): MacroStep[] {
    if (steps.length === 0) return steps;

    let processedSteps = steps;

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
