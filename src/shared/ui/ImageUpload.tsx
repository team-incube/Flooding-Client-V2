"use client";

import { ChangeEvent, useRef, useState, useEffect } from "react";
import Delete from "../asset/svg/Delete";
import Camera from "../asset/svg/Camera";
import Image from "next/image";
import { DashedBorder } from "../asset/svg/DashedBorder";

interface ImageUploadProps {
  onImageChange?: (file: File | null) => void;
  className?: string;
  disabled?: boolean;
}

export default function ImageUpload({ onImageChange, className, disabled }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleBoxClick = () => {
    if (disabled) return;
    fileRef.current?.click();
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange?.(file);

      if (preview) {
      URL.revokeObjectURL(preview);
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    }
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleDelete = (e: React.MouseEvent) => {
    if (disabled) return;
    e.stopPropagation();

    if (preview) {
    URL.revokeObjectURL(preview);
  }

    setPreview(null);
    onImageChange?.(null);
    if (fileRef.current) fileRef.current.value = "";
  }


  return (
    <div className={`relative flex flex-col gap-2 ${className}`}>
      <input 
        type="file"
        ref={fileRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={disabled}
      />

      <div
        onClick={preview ? undefined : handleBoxClick}
        className={`relative w-full rounded-[6.85px]
          ${preview ? "" : "border-p-1 "}
        `}
      >
        {preview ? (
          <div className="relative w-full h-[191.43px] rounded-[6.85px] overflow-hidden">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized
            />
            {!disabled && (
              <button
                onClick={handleDelete}
                className="absolute top-2 right-2 cursor-pointer transition-all p-1"
              >
                <Delete className="text-negative" />
              </button>
            )}
          </div>
        ) : (
          <div
            className="flex flex-col gap-2 items-center justify-center w-full h-[191.43px] bg-background cursor-pointer rounded-[6.85px]"
          >
            <DashedBorder />
            <Camera />
            <span className="text-text-4 text-sub-2">동아리 대표 사진을 등록하세요</span>
          </div>
        )}
      </div>
    </div>
  );
}