"use client";

import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Delete from "../asset/svg/Delete";
import Camera from "../asset/svg/Camera";
import Image from "next/image";
import { DashedBorder } from "../asset/svg/DashedBorder";

interface ImageUploadProps {
  onImageChange?: (file: File | null) => void;
  className?: string;
  disabled?: boolean;
}

export default function ImageUpload({
  onImageChange,
  className,
  disabled,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (accetedFiles: File[]) => {
      const file = accetedFiles[0];
      if (file) {
        onImageChange?.(file);
        if (preview) URL.revokeObjectURL(preview);
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
      }
    },
    [onImageChange, preview],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    disabled,
  });

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

    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    onImageChange?.(null);
  };

  return (
    <div className={`relative flex flex-col gap-2 ${className}`}>
      <div
        {...getRootProps({
          onClick: preview ? (e) => e.stopPropagation() : undefined,
        })}
        className={`relative w-full rounded-[6.85px] ${preview ? "" : "border-p-1"} `}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="relative h-[191.43px] w-full overflow-hidden rounded-[6.85px]">
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
                className="absolute top-2 right-2 cursor-pointer p-1 transition-all"
              >
                <Delete className="text-negative" />
              </button>
            )}
          </div>
        ) : (
          <div className="bg-background flex h-[191.43px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-[6.85px]">
            <DashedBorder />
            <Camera />
            <span className="text-text-4 text-sub-2">
              동아리 대표 사진을 등록하세요
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
