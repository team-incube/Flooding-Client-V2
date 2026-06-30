import type { ReactNode } from "react";

interface NoteTextProps {
  size?: "sm" | "md";
  tone?: "default" | "negative" | "primary";
  multiline?: boolean;
  children: ReactNode;
  className?: string;
}

const sizeStyles = {
  sm: "text-caption-2",
  md: "text-[15px] font-medium",
};

const toneStyles = {
  default: "text-sub-2",
  negative: "text-negative",
  primary: "text-p-1",
};

export function NoteText({
  size = "sm",
  tone = "default",
  multiline = false,
  children,
  className,
}: NoteTextProps) {
  const wrapStyle = multiline ? "" : "min-w-0 truncate";

  return (
    <p
      className={`${toneStyles[tone]} ${sizeStyles[size]}${wrapStyle ? ` ${wrapStyle}` : ""}${className ? ` ${className}` : ""}`}
    >
      {children}
    </p>
  );
}
