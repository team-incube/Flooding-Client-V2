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
      <div className="relative w-90 h-[203px] bg-sub-4 rounded-xl flex-shrink-0">
        {thumbnailUrl && (
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover rounded-xl"
          />
        )}

          <div className="absolute top-2 right-2">
            <Checkbox isActive={checked} />
          </div>
      </div>

      <div>{title}</div>
    </div>
  )
}