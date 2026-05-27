import type { ReactNode } from "react";

interface NoteTextProps {
  size?: "sm" | "md";
  children: ReactNode;
  className?: string;
}

const sizeStyles = {
  sm: "text-caption-2",
  md: "text-[15px] font-medium",
};

export function NoteText({ size = "sm", children, className }: NoteTextProps) {
  return (
    <p className={`text-sub-2 ${sizeStyles[size]}${className ? ` ${className}` : ""}`}>
      ※ {children}
    </p>
  );
}
