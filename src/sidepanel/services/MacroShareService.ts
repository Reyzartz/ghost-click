import { Macro } from "@/models";
import { BaseService } from "@/utils/BaseService";
import { Emitter } from "@/utils/Emitter";
import * as yup from "yup";

export interface ShareableMacro {
  version: string;
  name: string;
  domain: string;
  faviconUrl: string | null;
  steps: Macro["steps"];
}

export class MacroShareService extends BaseService {
  private static readonly SHARE_VERSION = "1.0.0";

  private static readonly shareableSchema = yup.object({
    version: yup.string().required("Version is required"),
    name: yup
      .string()
      .required("Macro name is required")
      .min(1, "Name cannot be empty"),
    domain: yup.string().required("Domain is required"),
    faviconUrl: yup.string().url("Must be a valid URL").nullable(),
    steps: yup
      .array()
      .of(
        yup.object({
          id: yup.string().required("Step ID is required"),
          name: yup.string().required("Step name is required"),
          type: yup
            .string()
            .oneOf(
              ["CLICK", "INPUT", "KEYPRESS", "NAVIGATE"],
              "Invalid step type"
            )
            .required("Step type is required"),
          timestamp: yup.number().nullable(),
          delay: yup.number().required("Delay is required").min(0),
          retryCount: yup.number().required("Retry count is required").min(0),
          retryInterval: yup
            .number()
            .required("Retry interval is required")
            .min(0),
          target: yup.object().when("type", {
            is: (type: string) => ["CLICK", "INPUT", "KEYPRESS"].includes(type),
            then: (schema) =>
              schema
                .shape({
                  id: yup.string(),
                  className: yup.string(),
                  xpath: yup.string(),
                  defaultSelector: yup
                    .string()
                    .oneOf(
                      ["id", "className", "xpath"],
                      "Invalid default selector"
                    )
                    .required("Default selector is required"),
                })
                .required("Target is required")
                .test(
                  "at-least-one-selector",
                  "At least one of id, className, or xpath is required",
                  (value) => !!(value?.id || value?.className || value?.xpath)
                ),
            otherwise: (schema) => schema.optional(),
          }),
          clicksCount: yup.number().when("type", {
            is: "CLICK",
            then: (schema) =>
              schema
                .required("Clicks count is required for CLICK steps")
                .min(1, "Clicks count must be at least 1"),
            otherwise: (schema) => schema.optional(),
          }),
          url: yup.string().when("type", {
            is: "NAVIGATE",
            then: (schema) =>
              schema
                .required("URL is required for NAVIGATE steps")
                .url("Must be a valid URL"),
            otherwise: (schema) => schema.optional(),
          }),
          value: yup.string().when("type", {
            is: "INPUT",
            then: (schema) =>
              schema.required("Value is required for INPUT steps"),
            otherwise: (schema) => schema.optional(),
          }),
          key: yup.string().when("type", {
            is: "KEYPRESS",
            then: (schema) =>
              schema.required("Key is required for KEYPRESS steps"),
            otherwise: (schema) => schema.optional(),
          }),
          code: yup.string().when("type", {
            is: "KEYPRESS",
            then: (schema) =>
              schema.required("Code is required for KEYPRESS steps"),
            otherwise: (schema) => schema.optional(),
          }),
          ctrlKey: yup.boolean().when("type", {
            is: "KEYPRESS",
            then: (schema) =>
              schema.required("ctrlKey is required for KEYPRESS steps"),
            otherwise: (schema) => schema.optional(),
          }),
          shiftKey: yup.boolean().when("type", {
            is: "KEYPRESS",
            then: (schema) =>
              schema.required("shiftKey is required for KEYPRESS steps"),
            otherwise: (schema) => schema.optional(),
          }),
          altKey: yup.boolean().when("type", {
            is: "KEYPRESS",
            then: (schema) =>
              schema.required("altKey is required for KEYPRESS steps"),
            otherwise: (schema) => schema.optional(),
          }),
          metaKey: yup.boolean().when("type", {
            is: "KEYPRESS",
            then: (schema) =>
              schema.required("metaKey is required for KEYPRESS steps"),
            otherwise: (schema) => schema.optional(),
          }),
        })
      )
      .required("Steps are required")
      .min(1, "At least one step is required"),
  });

  constructor(protected readonly emitter: Emitter) {
    super("MacroShareService", emitter);
  }

  init(): Promise<void> {
    this.logger.info("MacroShareService initialized");
    return Promise.resolve();
  }

  /**
   * Convert a macro to a shareable JSON string
   */
  toShareableString(macro: Macro): string {
    const shareable: ShareableMacro = {
      version: MacroShareService.SHARE_VERSION,
      name: macro.name,
      domain: macro.domain,
      faviconUrl: macro.faviconUrl,
      steps: macro.steps,
    };

    return JSON.stringify(shareable, null, 2);
  }

  /**
   * Create a new macro from a shareable JSON string
   */
  fromShareableString(shareableString: string): ShareableMacro {
    let shareable: ShareableMacro;

    // Parse JSON
    try {
      shareable = JSON.parse(shareableString) as ShareableMacro;
    } catch (err) {
      this.logger.error("Failed to parse JSON", { err });
      throw new Error("Invalid JSON format");
    }

    // Validate with Yup schema
    try {
      MacroShareService.shareableSchema.validateSync(shareable, {
        abortEarly: false,
      });
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        this.logger.error("Validation failed", { errors: err.errors });
        const errorMessages = err.errors.join("; ");
        throw new Error(`Validation failed: ${errorMessages}`);
      }
      throw err;
    }

    // Validate version
    if (shareable.version !== MacroShareService.SHARE_VERSION) {
      throw new Error(
        `Unsupported macro version: ${shareable.version}. Expected ${MacroShareService.SHARE_VERSION}`
      );
    }

    return {
      name: shareable.name,
      version: shareable.version,
      domain: shareable.domain,
      faviconUrl: shareable.faviconUrl,
      steps: shareable.steps,
    };
  }

  /**
   * Copy macro to clipboard as shareable JSON
   */
  async copyToClipboard(macro: Macro): Promise<void> {
    const shareableString = this.toShareableString(macro);

    try {
      await navigator.clipboard.writeText(shareableString);
      this.logger.info("Macro copied to clipboard", { macroId: macro.id });
    } catch (err) {
      this.logger.error("Failed to copy macro to clipboard", { err });
      throw new Error("Failed to copy to clipboard");
    }
  }

  /**
   * Read shareable macro from clipboard and create macro instance
   */
  async pasteFromClipboard(): Promise<ShareableMacro> {
    try {
      const clipboardText = await navigator.clipboard.readText();
      return this.fromShareableString(clipboardText);
    } catch (err) {
      this.logger.error("Failed to paste macro from clipboard", { err });
      throw new Error("Failed to paste from clipboard");
    }
  }
}
