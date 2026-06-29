"use client";

import Checkbox from "@/shared/asset/svg/Checkbox";
import CheckCircle from "@/shared/asset/svg/CheckCircle";
import Image from "next/image";

interface MusicRecommendCardProps {
  title: string;
  thumbnailUrl: string;
  durationText?: string;
  checked: boolean;
  onChange: () => void;
}

export default function MusicRecommendCard({
  title,
  thumbnailUrl,
  durationText,
  checked,
  onChange,
}: MusicRecommendCardProps) {
  return (
    <div
      onClick={onChange}
      className="w-full shrink-0 cursor-pointer sm:w-[calc((100%-0.75rem)/2)] lg:w-[calc((100%-1.5rem)/3)]"
    >
      <div className="bg-sub-4 relative h-[203px] w-full rounded-xl">
        {thumbnailUrl && (
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="rounded-xl object-cover"
          />
        )}

        <div className="absolute top-2 right-2 z-20">
          <Checkbox isActive={checked} />
        </div>

        {checked && (
          <div className="bg-background/80 absolute inset-0 z-10 flex items-center justify-center rounded-xl">
            <CheckCircle />
          </div>
        )}

        {durationText && (
          <span className="text-caption-3 absolute right-2 bottom-2 line-clamp-1 rounded bg-black/70 px-1.5 py-0.5 text-white">
            {durationText}
          </span>
        )}
      </div>

      <div className="text-text-3 text-main-text mt-2 truncate">{title}</div>
    </div>
  );
}
