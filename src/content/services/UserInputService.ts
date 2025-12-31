import { BaseService } from "@/utils/BaseService";
import { Emitter } from "@/utils/Emitter";
import { UserClickEventData } from "@/utils/Event";

export class UserInputService extends BaseService {
  private isRecording = false;
  private currentSessionId: string | null = null;
  private clickHandler: ((event: MouseEvent) => void) | null = null;

  constructor(protected readonly emitter: Emitter) {
    super("UserInputService", emitter);
  }

  init(): void {
    this.logger.info("UserInputService initialized");

    this.emitter.on("START_RECORDING", (data) => {
      this.startCapture(data.sessionId);
    });

    this.emitter.on("STOP_RECORDING", () => {
      this.stopCapture();
    });
  }

  private startCapture(sessionId: string): void {
    if (this.isRecording) {
      this.logger.warn("Already capturing user input");
      return;
    }

    this.isRecording = true;
    this.currentSessionId = sessionId;
    this.logger.info("Started capturing user input", { sessionId });

    this.clickHandler = (event: MouseEvent) => {
      this.captureClick(event);
    };

    document.addEventListener("click", this.clickHandler, true);
  }

  private stopCapture(): void {
    if (!this.isRecording) {
      this.logger.warn("Not currently capturing");
      return;
    }

    this.logger.info("Stopped capturing user input", {
      sessionId: this.currentSessionId,
    });

    if (this.clickHandler) {
      document.removeEventListener("click", this.clickHandler, true);
      this.clickHandler = null;
    }

    this.isRecording = false;
    this.currentSessionId = null;
  }

  private captureClick(event: MouseEvent): void {
    if (!this.isRecording || !this.currentSessionId) {
      return;
    }

    // TODO: Capture click on element in which the click handler is attached
    const target = event.target as HTMLElement;
    console.log("Captured click on element:", target);
    const clickData: UserClickEventData = {
      sessionId: this.currentSessionId,
      timestamp: Date.now(),
      type: "CLICK",
      target: {
        id: target.id || "",
        className: target.className || "",
        xpath: UserInputService.getXPath(target),
      },
    };

    this.logger.info("Click captured", clickData);

    // Emit USER_ACTION event
    this.emitter.emit("USER_ACTION", clickData);
  }

  private static getXPath(el: Document | Element | DocumentFragment) {
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
            (element as Element).namespaceURI === "http://www.w3.org/2000/svg";
          const name: string = isSVG ? `*[name()='${nodeName}']` : nodeName;
          const sameNodesCount: string = `[${
            [].indexOf.call(sames, element as never) + 1
          }]`;
          result = `/${name}${sames.length > 1 ? sameNodesCount : ""}${result}`;
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
}
