import Retry from "@/shared/asset/svg/Retry";

interface RetryButtonProps {
  onClick: () => void;
  count: number;
  max: number;
}

export default function RetryButton({ onClick, count, max }: RetryButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={count === max}
      className="flex flex-col items-center cursor-pointer"
    >
      <Retry />
      <span className="text-sub-2">
        ({count}/{max})
      </span>
    </button>
  );
}
