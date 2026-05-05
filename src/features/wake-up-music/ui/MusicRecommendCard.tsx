"use client";

import Checkbox from "@/shared/asset/svg/Checkbox";
import Image from "next/image";

interface MusicRecommendCardProps {
  title: string;
  thumbnailUrl: string;
  checked: boolean;
  onChange: () => void;
}

export default function MusicRecommendCard({
  title,
  thumbnailUrl,
  checked,
  onChange,
}: MusicRecommendCardProps) {
  return (
    <div onClick={onChange} className="cursor-pointer">
      <div className="bg-sub-4 relative h-[203px] w-90 shrink-0 rounded-xl">
        {thumbnailUrl && (
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="rounded-xl object-cover"
          />
        )}

        <div className="absolute top-2 right-2">
          <Checkbox isActive={checked} />
        </div>
      </div>

      <div>{title}</div>
    </div>
  );
}
