"use client";

import { usePathname, useRouter } from "next/navigation";
import Back from "@/shared/asset/svg/Back";
import { TextButton } from "@/shared/ui/Button/TextButton";

export default function ClubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const showBackButton = pathname !== "/club";

  return (
    <>
      {showBackButton && (
        <div className="flex w-full px-0 py-3 sm:px-8 lg:px-8 xl:px-10 2xl:px-18">
          <TextButton
            variant="outlined"
            size="fit"
            className="gap-1"
            onClick={() => router.back()}
          >
            <Back direction="left" />
            뒤로가기
          </TextButton>
        </div>
      )}
      {children}
    </>
  );
}
