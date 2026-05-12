export type TextButtonVariant =
  | "filled"
  | "outlined"
  | "negative"
  | "disabled"
  | "ghost";
type ButtonSize = "small" | "wide" | "medium" | "fit";

interface TextButtonProps {
  variant?: TextButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const variantStyles = {
  filled: "bg-p-1 text-background-surface cursor-pointer",
  outlined:
    "bg-background-surface text-sub-1 border border-sub-2 cursor-pointer",
  negative: "bg-negative text-sub-4 cursor-pointer",
  disabled: "bg-p-3 text-sub-4",
  ghost: "bg-p-3 text-sub-4 cursor-pointer",
};

const sizeStyles = {
  small: "w-[91px] h-[43px]",
  wide: "w-[330px] h-[47px]",
  medium: "w-[147px] h-[43px]",
  fit: "min-w-[91px] h-[43px] px-4",
};

const baseStyles =
  "flex shrink-0 items-center justify-center rounded-lg text-text-4 whitespace-nowrap outline-none disabled:cursor-default";

export function TextButton({
  variant = "filled",
  size = "small",
  className,
  children,
  onClick,
  disabled = false,
}: TextButtonProps) {
  const isDisabled = disabled || variant === "disabled";

  return (
    <button
      disabled={isDisabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className ?? ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
