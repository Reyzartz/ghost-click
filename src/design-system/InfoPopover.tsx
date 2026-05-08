import { useState } from "react";
import { usePopper } from "react-popper";
import { Info } from "lucide-react";
import { Text } from "@/design-system";

interface InfoPopoverProps {
  content: string;
}

export const InfoPopover = ({ content }: InfoPopoverProps) => {
  const [visible, setVisible] = useState(false);
  const [referenceEl, setReferenceEl] = useState<HTMLButtonElement | null>(
    null
  );
  const [popperEl, setPopperEl] = useState<HTMLDivElement | null>(null);
  const [arrowEl, setArrowEl] = useState<HTMLDivElement | null>(null);

  const { styles, attributes } = usePopper(referenceEl, popperEl, {
    placement: "top",
    modifiers: [
      { name: "arrow", options: { element: arrowEl } },
      { name: "offset", options: { offset: [0, 10] } },
    ],
  });

  return (
    <span className="inline-flex items-center">
      <button
        ref={setReferenceEl}
        type="button"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        className="text-text-muted hover:text-text inline-flex transition-colors"
        tabIndex={-1}
      >
        <Info className="h-3.5 w-3.5" />
      </button>

      <div
        ref={setPopperEl}
        style={styles.popper}
        {...attributes.popper}
        className={visible ? "z-50" : "pointer-events-none invisible"}
      >
        <div className="border-border bg-surface w-48 rounded-lg border px-2.5 py-2 shadow-lg">
          <Text variant="small" color="muted">
            {content}
          </Text>
        </div>

        {/* Arrow pointing down toward the reference */}
        <div ref={setArrowEl} style={styles.arrow} className="absolute">
          <div className="border-border bg-surface h-2.5 w-2.5 -translate-y-1/2 rotate-45 border-r border-b" />
        </div>
      </div>
    </span>
  );
};
