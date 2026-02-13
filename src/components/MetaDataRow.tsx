import { Text } from "@/design-system";

interface MacroMetadataRowProps {
  label: string;
  value: string | number;
}

const MacroMetadataRow = ({ label, value }: MacroMetadataRowProps) => (
  <div className="mb-2 flex items-center justify-between last-of-type:mb-0">
    <Text variant="small" color="muted">
      {label}:
    </Text>
    <Text variant="small" className="font-medium">
      {value}
    </Text>
  </div>
);

export { MacroMetadataRow };
