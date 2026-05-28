import Signout from "@/shared/asset/svg/Signout";
import { useSignOut } from "../lib/useSignOut";

export const SignOutButton = () => {
  const { handleSignout } = useSignOut();

  return (
    <button
      type="button"
      className="flex h-14 w-full cursor-pointer items-center justify-center py-3"
      onClick={handleSignout}
    >
      <div className="flex items-center gap-6">
        <div className="flex shrink-0 items-center justify-center">
          <Signout size={32} />
        </div>
        <span className="text-text-1 text-sub-2 hidden lg:block">로그아웃</span>
      </div>
    </button>
  );
};
