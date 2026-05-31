"use client";

import { useRouter } from "next/navigation";
import Back from "@/shared/asset/svg/Back";

export function ClubBackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="flex size-8 shrink-0 cursor-pointer items-center justify-center"
      aria-label="뒤로가기"
    >
      <Back direction="left" size={32} />
    </button>
  );
}
