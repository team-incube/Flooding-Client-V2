import type { ReactNode } from "react";

interface NoteTextProps {
  size?: "sm" | "md";
  tone?: "default" | "negative" | "primary";
  children: ReactNode;
  className?: string;
}

const sizeStyles = {
  sm: "text-caption-2 min-w-0 truncate",
  md: "min-w-0 truncate text-[15px] font-medium",
};

const toneStyles = {
  default: "text-sub-2",
  negative: "text-negative",
  primary: "text-p-1",
};

export function NoteText({
  size = "sm",
  tone = "default",
  children,
  className,
}: NoteTextProps) {
  return (
    <p
      className={`${toneStyles[tone]} ${sizeStyles[size]}${className ? ` ${className}` : ""}`}
    >
      {children}
    </p>
  );
}
