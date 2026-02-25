type ButtonVariant = "filled" | "outlined" | "disabled";
type ButtonSize = "small" | "wide";

interface TextButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  onClick?: () => void;
}

const variantStyles = {
  filled: "bg-(--color-p-1) text-(--background-surface) cursor-pointer",
  outlined:
    "bg-white text-(--color-sub-1) border border-(--color-sub-2) cursor-pointer",
  disabled: "bg-(--color-p-3) text-(--color-sub-4)",
};

const sizeStyles = {
  small: "w-[91px] h-[43px]",
  wide: "w-[330px] h-[47px]",
};

const baseStyles =
  "flex items-center justify-center font-medium rounded-lg text-[15px] outline-none";

export function TextButton({
  variant = "filled",
  size = "small",
  children,
  onClick,
}: TextButtonProps) {
  return (
    <button
      disabled={variant === "disabled"}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
