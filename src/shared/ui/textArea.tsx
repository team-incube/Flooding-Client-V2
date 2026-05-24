import type { TextareaHTMLAttributes } from "react";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

const baseStyles =
  "w-full min-h-[96px] resize-y rounded-lg border border-sub-2 bg-background-surface px-4 py-3 text-main-text outline-none placeholder:text-sub-2 focus:border-sub-1 caret-p-1";

export default function TextArea({ className, ...props }: TextAreaProps) {
  return <textarea className={`${baseStyles} ${className ?? ""}`} {...props} />;
}
