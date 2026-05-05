import Image from "next/image";
import { useRef } from "react";
import Camera from "@/shared/asset/svg/Camera";
import DefaultClubThumbnail from "@/shared/asset/svg/DefaultThumbnail";

interface ClubThumbnailProps {
  imageUrl?: string;
  isEdit?: boolean;
  onImageChange: (file: File) => void;
}

export function ClubThumbnail({ imageUrl, isEdit, onImageChange }: ClubThumbnailProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-sub-4">
      {imageUrl ? (
        <Image src={imageUrl} alt="club thumbnail" fill className="object-cover" />
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <DefaultClubThumbnail className="w-full h-full" />
        </div>
      )}
      
      {isEdit && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-3 right-4 flex items-center justify-center cursor-pointer"
        >
          <Camera isActive={true}/>
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