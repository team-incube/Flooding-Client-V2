import { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  rightIcon?: ReactNode;
}

export default function TextField({
  rightIcon,
  className,
  ...props
}: InputProps) {
  return (
    <div className={`relative ${className}`}>
      <input
        className={`
          w-full h-[52px] rounded-[8px] border transition-all outline-none
          bg-background-surface border-sub-2 text-main-text
          placeholder:text-sub-2 focus:border-sub-1 caret-[#527CD7]
          pl-4 ${rightIcon ? "pr-12" : "pr-4"}
        `}
        {...props}
      />

      {rightIcon && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {rightIcon}
        </div>
      )}
    </div>
  );
}
