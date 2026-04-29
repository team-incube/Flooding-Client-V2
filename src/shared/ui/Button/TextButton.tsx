type ButtonVariant = "filled" | "outlined" | "disabled";
type ButtonSize = "small" | "wide" | "medium";

interface TextButtonProps {
  variant?: ButtonVariant;
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
  disabled: "bg-p-3 text-sub-4",
};

const sizeStyles = {
  small: "w-[91px] h-[43px]",
  wide: "w-[330px] h-[47px]",
  medium: "w-[147px] h-[43px]",
};

const baseStyles =
  "flex items-center justify-center rounded-lg text-text-4 outline-none";

export function TextButton({
  variant = "filled",
  size = "small",
  className,
  children,
  onClick,
}: TextButtonProps) {
  return (
    <button
      disabled={variant === "disabled"}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className ?? ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
