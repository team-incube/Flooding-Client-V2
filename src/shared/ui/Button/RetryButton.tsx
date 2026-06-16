import Retry from "@/shared/asset/svg/Retry";

interface RetryButtonProps {
  onClick: () => void;
  count: number;
  max: number;
  disabled?: boolean;
}

export default function RetryButton({
  onClick,
  count,
  max,
  disabled = false,
}: RetryButtonProps) {
  const isDisabled = count === max || disabled;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`flex flex-col items-center ${
        isDisabled ? "pointer-events-none opacity-50" : "cursor-pointer"
      }`}
    >
      <Retry />
      <span className="text-sub-2">
        ({count}/{max})
      </span>
    </button>
  );
}
