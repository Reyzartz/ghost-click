import { HTMLAttributes } from "react";
import { LucideIcon } from "lucide-react";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { Icon, IconSize } from "./Icon";

export type KbdSize = "sm" | "md" | "lg";

const kbdVariants = cva(
  "inline-flex items-center justify-center rounded-sm border border-border bg-surface font-mono font-medium text-text-muted shrink-0",
  {
    variants: {
      size: {
        sm: "h-4 min-w-4 px-1 text-[10px] leading-2.5",
        md: "h-5 min-w-5 px-1.5 text-xs leading-3",
        lg: "h-6 min-w-6 px-2 text-sm leading-4",
      },
      iconOnly: {
        true: "pl-0 pr-0 aspect-square",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      iconOnly: false,
    },
  }
);

const ICON_SIZE_MAP: Record<KbdSize, IconSize> = {
  sm: "xs",
  md: "sm",
  lg: "md",
};

interface KbdProps extends HTMLAttributes<HTMLSpanElement> {
  size?: KbdSize;
  icon?: LucideIcon;
  children?: React.ReactNode;
}

export const Kbd = ({
  size = "md",
  icon,
  children,
  className,
  ...props
}: KbdProps) => {
  const classes = clsx(kbdVariants({ size, iconOnly: !!icon }), className);

  return (
    <kbd className={classes} {...props}>
      {icon ? (
        <Icon icon={icon} size={ICON_SIZE_MAP[size]} color="muted" />
      ) : (
        children
      )}
    </kbd>
  );
};
