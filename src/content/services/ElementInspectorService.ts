import { BaseService } from "@/utils/BaseService";
import { Emitter } from "@/utils/Emitter";
import { TargetElementSelector } from "@/models";
import { ElementSelector } from "@/utils/ElementSelector";

export class ElementInspectorService extends BaseService {
  private isInspecting = false;
  private highlightedElement: HTMLElement | null = null;
  private overlay: HTMLDivElement | null = null;

  constructor(protected readonly emitter: Emitter) {
    super("ElementInspectorService", emitter);
  }

  async init(): Promise<void> {
    this.logger.info("ElementInspectorService initialized");

    this.emitter.on("START_ELEMENT_INSPECTION", () => {
      this.startInspection();
    });

    this.emitter.on("STOP_ELEMENT_INSPECTION", () => {
      this.stopInspection();
    });
  }

  private startInspection(): void {
    if (this.isInspecting) return;

    this.isInspecting = true;
    this.logger.info("Element inspection started");

    document.addEventListener("mouseover", this.handleMouseOver);
    document.addEventListener("mouseout", this.handleMouseOut);
    document.addEventListener("click", this.handleClick, true);

    // Add cursor style
    document.body.style.cursor = "crosshair";
  }

  private stopInspection(): void {
    if (!this.isInspecting) return;

    this.isInspecting = false;
    this.logger.info("Element inspection stopped");

    document.removeEventListener("mouseover", this.handleMouseOver);
    document.removeEventListener("mouseout", this.handleMouseOut);
    document.removeEventListener("click", this.handleClick, true);

    this.removeHighlight();
    document.body.style.cursor = "";
  }

  private handleMouseOver = (e: MouseEvent): void => {
    if (!this.isInspecting) return;

    const target = e.target as HTMLElement;
    if (target && target !== this.overlay) {
      this.highlightElement(target);
    }
  };

  private handleMouseOut = (e: MouseEvent): void => {
    if (!this.isInspecting) return;

    const target = e.target as HTMLElement;
    if (target === this.highlightedElement) {
      this.removeHighlight();
    }
  };

  private handleClick = (e: MouseEvent): void => {
    if (!this.isInspecting) return;

    e.preventDefault();
    e.stopPropagation();

    const target = e.target as HTMLElement;
    if (!target || target === this.overlay) return;

    const selector = ElementSelector.getElementSelector(target);

    this.logger.info("Element selected", { selector });

    // Emit locally and broadcast to sidepanel
    this.emitter.emit("ELEMENT_SELECTED", { selector });

    this.stopInspection();
  };

  private highlightElement(element: HTMLElement): void {
    this.removeHighlight();

    this.highlightedElement = element;

    if (!this.overlay) {
      this.overlay = document.createElement("div");
      this.overlay.style.cssText = `
        position: absolute;
        pointer-events: none;
        border: 2px solid #3b82f6;
        background: rgba(59, 130, 246, 0.1);
        z-index: 2147483647;
        box-sizing: border-box;
      `;
      document.body.appendChild(this.overlay);
    }

    const rect = element.getBoundingClientRect();
    this.overlay.style.top = `${rect.top + window.scrollY}px`;
    this.overlay.style.left = `${rect.left + window.scrollX}px`;
    this.overlay.style.width = `${rect.width}px`;
    this.overlay.style.height = `${rect.height}px`;
    this.overlay.style.display = "block";
  }

  private removeHighlight(): void {
    if (this.overlay) {
      this.overlay.style.display = "none";
    }
    this.highlightedElement = null;
  }
}
