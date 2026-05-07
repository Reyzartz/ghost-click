import { Macro } from "@/models";
import { memo } from "react";
import { clsx } from "clsx";
import { Text } from "@/design-system";
import { useState } from "react";

type DisplayFaviconSize = "small" | "medium" | "large";

interface DisplayFaviconProps {
  faviconUrl: Macro["faviconUrl"];
  name: string;
  size?: DisplayFaviconSize;
  className?: string;
}

const sizeMap: Record<DisplayFaviconSize, string> = {
  small: "w-5 h-5 p-px",
  medium: "w-9 h-9 p-1",
  large: "w-13 h-13 p-1.5",
};
const DisplayFavicon = memo(
  ({ faviconUrl, name, size = "medium", className }: DisplayFaviconProps) => {
    const [imgBroken, setImgBroken] = useState(false);

    const showFallback = !faviconUrl || imgBroken;

    return (
      <div
        className={clsx(
          sizeMap[size],
          "bg-surface-active flex shrink-0 items-center justify-center rounded",
          className
        )}
      >
        {showFallback ? (
          <Text variant="small" color="muted" className="select-none">
            {name.charAt(0).toUpperCase()}
          </Text>
        ) : (
          <img
            src={faviconUrl}
            alt="Favicon"
            className="h-full w-full rounded-sm object-contain object-center"
            onError={() => setImgBroken(true)}
          />
        )}
      </div>
    );
  }
);

DisplayFavicon.displayName = "DisplayFavicon";

export { DisplayFavicon };
