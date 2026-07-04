import { ResolvableStepType, TargetElementSelector } from "@/models/MacroStep";
import { ElementSelector } from "@/utils/ElementSelector";

type SelectorStrategy =
  | "id"
  | "xpath"
  | "className"
  | "testId"
  | "ariaLabel"
  | "name"
  | "text";

export type TargetValidationErrorCode =
  | "NOT_FOUND"
  | "AMBIGUOUS_SELECTOR"
  | "WRONG_ELEMENT_TYPE"
  | "NOT_INTERACTABLE";

export interface TargetResolutionSuccess {
  valid: true;
  element: Element;
}

export interface TargetResolutionFailure {
  valid: false;
  code: TargetValidationErrorCode;
  message: string;
  retryable: boolean;
}

export type TargetResolutionResult =
  | TargetResolutionSuccess
  | TargetResolutionFailure;

export class StepValidationError extends Error {
  constructor(
    public readonly code: TargetValidationErrorCode,
    message: string
  ) {
    super(message);
    this.name = "StepValidationError";
  }
}

const STABILITY_ORDER: SelectorStrategy[] = [
  "id",
  "testId",
  "name",
  "xpath",
  "ariaLabel",
  "className",
  "text",
];

const TEXT_MATCH_TAGS = new Set([
  "BUTTON",
  "A",
  "LABEL",
  "SPAN",
  "DIV",
  "TD",
  "TH",
  "LI",
  "SUMMARY",
]);

export class TargetResolver {
  static resolve(
    target: TargetElementSelector,
    stepType: ResolvableStepType
  ): TargetResolutionResult {
    const order = TargetResolver.buildSelectorOrder(target, stepType);

    if (order.length === 0) {
      return {
        valid: false,
        code: "NOT_FOUND",
        retryable: false,
        message: "This step has no recorded selector to match against.",
      };
    }

    for (const strategy of order) {
      const { element, matchCount } = TargetResolver.queryBySelector(
        target,
        strategy
      );

      if (!element) {
        continue;
      }

      if (matchCount > 1) {
        return {
          valid: false,
          code: "AMBIGUOUS_SELECTOR",
          retryable: false,
          message: `The ${strategy} selector matched ${matchCount} elements instead of exactly one, so ghost-click can't tell which one to use.`,
        };
      }

      const typeCheck = TargetResolver.checkElementType(element, stepType);
      if (!typeCheck.ok) {
        return {
          valid: false,
          code: "WRONG_ELEMENT_TYPE",
          retryable: false,
          message: typeCheck.message,
        };
      }

      const interactableCheck = TargetResolver.checkInteractable(element);
      if (!interactableCheck.ok) {
        return {
          valid: false,
          code: "NOT_INTERACTABLE",
          retryable: true,
          message: interactableCheck.message,
        };
      }

      return { valid: true, element };
    }

    return {
      valid: false,
      code: "NOT_FOUND",
      retryable: true,
      message: `No element matched any recorded selector for this step (tried: ${order.join(", ")}). It may not exist on this page yet.`,
    };
  }

  private static buildSelectorOrder(
    target: TargetElementSelector,
    stepType: ResolvableStepType
  ): SelectorStrategy[] {
    return STABILITY_ORDER.filter((strategy) => {
      if (strategy === "text" && stepType === "INPUT") {
        return false;
      }
      return Boolean(target[strategy]);
    });
  }

  private static queryBySelector(
    target: TargetElementSelector,
    strategy: SelectorStrategy
  ): { element: Element | null; matchCount: number } {
    switch (strategy) {
      case "id": {
        const element = ElementSelector.findElementFromId(target.id);
        const matchCount = document.querySelectorAll(
          `[id="${CSS.escape(target.id)}"]`
        ).length;
        return { element, matchCount };
      }
      case "xpath": {
        const element = ElementSelector.findElementFromXPath(target.xpath);
        const matchCount = document.evaluate(
          target.xpath,
          document,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null
        ).snapshotLength;
        return { element, matchCount };
      }
      case "className": {
        const element = ElementSelector.findElementFromClassName(
          target.className
        );
        const matchCount = document.querySelectorAll(
          `.${target.className}`
        ).length;
        return { element, matchCount };
      }
      case "testId": {
        const selector = `[data-testid="${CSS.escape(target.testId ?? "")}"]`;
        return {
          element: document.querySelector(selector),
          matchCount: document.querySelectorAll(selector).length,
        };
      }
      case "ariaLabel": {
        const selector = `[aria-label="${CSS.escape(target.ariaLabel ?? "")}"]`;
        return {
          element: document.querySelector(selector),
          matchCount: document.querySelectorAll(selector).length,
        };
      }
      case "name": {
        const selector = `[name="${CSS.escape(target.name ?? "")}"]`;
        return {
          element: document.querySelector(selector),
          matchCount: document.querySelectorAll(selector).length,
        };
      }
      case "text": {
        const matches = TargetResolver.findByOwnText(target.text ?? "");
        return { element: matches[0] ?? null, matchCount: matches.length };
      }
    }
  }

  private static findByOwnText(text: string): Element[] {
    const matches: Element[] = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_ELEMENT
    );
    let node = walker.nextNode() as Element | null;

    while (node) {
      if (
        TEXT_MATCH_TAGS.has(node.tagName) &&
        ElementSelector.getOwnText(node) === text
      ) {
        matches.push(node);
      }
      node = walker.nextNode() as Element | null;
    }

    return matches;
  }

  private static checkElementType(
    element: Element,
    stepType: ResolvableStepType
  ): { ok: true } | { ok: false; message: string } {
    const tag = element.tagName.toLowerCase();

    if (stepType === "INPUT") {
      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement
      ) {
        return { ok: true };
      }
      return {
        ok: false,
        message: `Found a matching <${tag}> element, but an INPUT step needs an <input> or <textarea>.`,
      };
    }

    if (element instanceof HTMLElement) {
      return { ok: true };
    }
    return {
      ok: false,
      message: `Found a matching <${tag}> element, but a ${stepType} step needs a clickable HTML element.`,
    };
  }

  private static checkInteractable(
    element: Element
  ): { ok: true } | { ok: false; message: string } {
    if (!element.isConnected) {
      return {
        ok: false,
        message:
          "Target element was found but has been removed from the page (detached from the DOM).",
      };
    }

    if (!TargetResolver.isVisible(element)) {
      return {
        ok: false,
        message:
          "Target element was found but is hidden (zero size or hidden via CSS) and can't be interacted with.",
      };
    }

    if (
      "disabled" in element &&
      Boolean((element as { disabled?: boolean }).disabled)
    ) {
      return {
        ok: false,
        message:
          "Target element was found but is disabled and can't be interacted with.",
      };
    }

    return { ok: true };
  }

  private static isVisible(element: Element): boolean {
    if (
      typeof (element as { checkVisibility?: unknown }).checkVisibility ===
      "function"
    ) {
      return (
        element as unknown as { checkVisibility: () => boolean }
      ).checkVisibility();
    }

    const rect = element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      return false;
    }

    const style = window.getComputedStyle(element);
    if (
      style.display === "none" ||
      style.visibility === "hidden" ||
      style.visibility === "collapse" ||
      style.opacity === "0"
    ) {
      return false;
    }

    return true;
  }
}
