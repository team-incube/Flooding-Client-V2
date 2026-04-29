type NumberButtonVariant = "outlined" | "filled";

interface NumberButtonProps {
  variant?: NumberButtonVariant;
  children: React.ReactNode;
  onClick?: () => void;
}

const variantStyles = {
  outlined:
    "bg-background-surface text-sub-1 border border-sub-2 cursor-pointer",
  filled: "bg-p-1 text-background-surface cursor-pointer",
};

const baseStyles =
  "flex items-center justify-center w-[48px] h-[34px] rounded-lg text-text-4 outline-none";

export function NumberButton({
  variant = "outlined",
  children,
  onClick,
}: NumberButtonProps) {
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
