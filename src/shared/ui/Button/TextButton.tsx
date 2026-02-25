type ButtonVariant = "filled" | "outlined" | "disabled";
type ButtonSize = "small" | "wide";

interface TextButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  onClick?: () => void;
}

const variantStyles = {
  filled: "bg-p-1 text-background-surface cursor-pointer",
  outlined: "bg-white text-sub-1 border border-sub-2 cursor-pointer",
  disabled: "bg-p-3 text-sub-4",
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
