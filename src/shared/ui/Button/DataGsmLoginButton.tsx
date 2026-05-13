import DBlack from "@/shared/asset/svg/DBlack";
import DWhite from "@/shared/asset/svg/DWhite";

interface DataGsmLoginButtonProps {
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const buttonStyles =
  "inline-flex h-11 items-center justify-center gap-4 rounded-lg bg-black px-4 font-[Pretendard,sans-serif] text-[14px] font-medium whitespace-nowrap text-white transition-all duration-200 ease-in-out cursor-pointer hover:bg-[#222222] disabled:cursor-default disabled:opacity-70 dark:bg-white dark:text-black dark:hover:bg-[#efefef]";

export function DataGsmLoginButton({
  className,
  disabled = false,
  onClick,
}: DataGsmLoginButtonProps) {
  return (
    <button
      type="button"
      className={`${buttonStyles} ${className ?? ""}`}
      disabled={disabled}
      onClick={onClick}
    >
      <span className="block dark:hidden">
        <DWhite />
      </span>
      <span className="hidden dark:block">
        <DBlack />
      </span>
      DataGSM으로 로그인
    </button>
  );
}
