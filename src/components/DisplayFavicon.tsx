import { Macro } from "@/models";
import { memo } from "react";
import { Text } from "@/design-system";

type DisplayFaviconSize = "small" | "medium" | "large";

interface DisplayFaviconProps {
  faviconUrl: Macro["faviconUrl"];
  name: string;
  size?: DisplayFaviconSize;
  className?: string;
}

const sizeMap: Record<DisplayFaviconSize, string> = {
  small: "w-4 h-4 p-px",
  medium: "w-8 h-8 p-1",
  large: "w-12 h-12 p-2",
};

const DisplayFavicon = memo(
  ({ faviconUrl, name, size = "medium", className }: DisplayFaviconProps) => {
    return (
      <div
        className={
          sizeMap[size] +
          " flex items-center justify-center rounded bg-slate-100 shrink-0 " +
          className
        }
      >
        {faviconUrl ? (
          <img
            src={faviconUrl}
            alt="Favicon"
            className="w-full h-full object-center object-contain"
          />
        ) : (
          <Text variant="small" color="muted" className="select-none">
            {name.charAt(0).toUpperCase()}
          </Text>
        )}
      </div>
    );
  }
);

DisplayFavicon.displayName = "DisplayFavicon";

export { DisplayFavicon };
