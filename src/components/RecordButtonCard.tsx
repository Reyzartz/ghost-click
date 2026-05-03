import { Card, Button } from "@/design-system";
import clsx from "clsx";
import { CircleSmall } from "lucide-react";
import { memo } from "react";

interface RecordButtonCardProps {
  visible: boolean;
  onClick: () => void;
}

const RecordButtonCard = memo<RecordButtonCardProps>(({ visible, onClick }) => {
  return (
    <div
      className={clsx(
        "overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out",
        visible ? "max-h-15 opacity-100" : "max-h-0 opacity-0"
      )}
    >
      <Card size="md" className="rounded-lg px-2.5 duration-300 ease-in-out">
        <Button
          onClick={onClick}
          variant="primary"
          icon={CircleSmall}
          iconFilled
          fullWidth
        >
          Start recording
        </Button>
      </Card>
    </div>
  );
});

RecordButtonCard.displayName = "RecordButtonCard";

export { RecordButtonCard };
