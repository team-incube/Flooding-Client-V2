import Image from "next/image";
import { useRef } from "react";
import Camera from "@/shared/asset/svg/Camera";
import DefaultClubThumbnail from "@/shared/asset/svg/DefaultThumbnail";

interface ClubThumbnailProps {
  imageUrl?: string;
  isEdit?: boolean;
  onImageChange: (file: File) => void;
}

export function ClubThumbnail({
  imageUrl,
  isEdit,
  onImageChange,
}: ClubThumbnailProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-sub-4 relative aspect-video w-full overflow-hidden rounded-2xl">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt="club thumbnail"
          fill
          className="object-cover"
          unoptimized
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <DefaultClubThumbnail className="h-full w-full" />
        </div>
      )}

      {isEdit && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute right-4 bottom-3 flex cursor-pointer items-center justify-center"
        >
          <Camera isActive={true} />
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onImageChange(file);
            }}
          />
        </button>
      )}
    </div>
  );
}
