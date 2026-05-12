import type { InputHTMLAttributes, ReactNode } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  rightIcon?: ReactNode;
  inputClassName?: string;
}

export default function TextField({
  rightIcon,
  className,
  inputClassName,
  ...props
}: TextFieldProps) {
  return (
    <div className={`relative ${className}`}>
      <input
        className={`bg-background-surface border-sub-2 text-main-text placeholder:text-sub-2 focus:border-sub-1 h-[52px] w-full rounded-[8px] border pl-4 caret-[#527CD7] outline-none ${rightIcon ? "pr-12" : "pr-4"} ${inputClassName ?? ""} `}
        {...props}
      />

      {rightIcon && (
        <div className="absolute top-1/2 right-4 -translate-y-1/2">
          {rightIcon}
        </div>
      )}
    </div>
  );
}
