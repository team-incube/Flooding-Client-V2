import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

const baseStyles =
  "h-[52px] w-full rounded-lg border border-sub-2 bg-background-surface px-4 py-3 text-main-text outline-none placeholder:text-sub-2 focus:border-sub-1 caret-p-1";

export default function Select({ className, ...props }: SelectProps) {
  return <select className={`${baseStyles} ${className ?? ""}`} {...props} />;
}
