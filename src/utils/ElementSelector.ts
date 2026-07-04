import { ResolvableStepType, TargetElementSelector } from "@/models";

export class ElementSelector {
  static readonly findElementFromXPath = (xpath: string): Element | null => {
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    );
    return result.singleNodeValue as Element | null;
  };

  static readonly findElementFromId = (id: string): Element | null => {
    return document.getElementById(id);
  };

  static readonly findElementFromClassName = (
    className: string
  ): Element | null => {
    return document.querySelector(`.${className}`);
  };

  static getId(el: Element): string {
    return el.id || "";
  }

  static getClassName(el: Element): string {
    if (el.classList.length === 0) {
      return "";
    }
    return Array.from(el.classList)
      .filter((cls) => cls.trim().length > 0)
      .join(".");
  }

  static getXPath(el: Document | Element | DocumentFragment) {
    let element: Element | (Node & ParentNode) = el;
    let parent: Element | (Node & ParentNode) | null;
    let sames: Node[];
    let elementType: number;
    let result = "";

    const escapeXPath = (name: string): string =>
      name.replace(/([:*])/g, "\\$1"); // Escapes colons and asterisks

    const filterNode = (_node: Node): void => {
      if (_node.nodeName === element.nodeName) {
        sames.push(_node);
      }
    };

    if (!(element instanceof Node)) {
      return result;
    }

    parent = element.parentNode ?? element.ownerDocument ?? null;

    while (parent !== null) {
      elementType = element.nodeType;
      sames = [];

      try {
        parent.childNodes.forEach(filterNode);
      } catch {
        break;
      }

      const nodeNameEscaped: string = escapeXPath(element.nodeName);

      switch (elementType) {
        case Node.ELEMENT_NODE: {
          const nodeName: string = nodeNameEscaped.toLowerCase();
          const isSVG =
            element instanceof SVGElement &&
            (element as Element).namespaceURI === "http://www.w3.org/2000/svg";

          if (isSVG) {
            break;
          }

          const sameNodesCount: string = `[${
            [].indexOf.call(sames, element as never) + 1
          }]`;

          result = `/${nodeName}${
            sames.length > 1 ? sameNodesCount : ""
          }${result}`;
          break;
        }

        case Node.TEXT_NODE: {
          const textNodes: ChildNode[] = Array.from(parent.childNodes).filter(
            (n) => n.nodeType === Node.TEXT_NODE
          );
          const index: number =
            element instanceof Node && "remove" in element
              ? [].indexOf.call(sames, element as never) + 1
              : 1;

          result = `/text()${
            textNodes.length > 1 ? `[${index}]` : ""
          }${result}`;
          break;
        }

        case Node.ATTRIBUTE_NODE: {
          result = `/@${nodeNameEscaped.toLowerCase()}${result}`;
          break;
        }

        case Node.COMMENT_NODE: {
          const index: number =
            Array.from(parent.childNodes)
              .filter((n) => n.nodeType === Node.COMMENT_NODE)
              .indexOf(element as never) + 1;
          result = `/comment()[${index}]${result}`;
          break;
        }

        case Node.PROCESSING_INSTRUCTION_NODE: {
          result = `/processing-instruction('${nodeNameEscaped}')${result}`;
          break;
        }

        case Node.DOCUMENT_NODE: {
          result = `/${result}`;
          break;
        }

        default:
          break;
      }

      element = parent;
      parent = element.parentNode ?? element.ownerDocument ?? null;
    }

    return `.//${result.replace(/^\//, "")}`;
  }

  static getTestId(el: Element): string {
    return el.getAttribute("data-testid") || "";
  }

  static getAriaLabel(el: Element): string {
    return el.getAttribute("aria-label") || "";
  }

  static getName(el: Element): string {
    if (
      el instanceof HTMLInputElement ||
      el instanceof HTMLTextAreaElement ||
      el instanceof HTMLSelectElement
    ) {
      return el.name || "";
    }
    return el.getAttribute("name") || "";
  }

  static getOwnText(el: Element): string {
    const ownText = Array.from(el.childNodes)
      .filter((n) => n.nodeType === Node.TEXT_NODE)
      .map((n) => n.textContent || "")
      .join(" ");
    return ownText.replace(/\s+/g, " ").trim().slice(0, 120);
  }

  static getElementSelector(
    element: HTMLElement,
    stepType: ResolvableStepType
  ): TargetElementSelector {
    const id = ElementSelector.getId(element);
    const className = ElementSelector.getClassName(element);
    const xpath = ElementSelector.getXPath(element);
    const testId = ElementSelector.getTestId(element);
    const ariaLabel = ElementSelector.getAriaLabel(element);
    const name = ElementSelector.getName(element);
    const text =
      stepType === "INPUT" ? "" : ElementSelector.getOwnText(element);

    return {
      id,
      className,
      xpath,
      testId,
      ariaLabel,
      name,
      text,
    };
  }
}
