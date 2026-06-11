"use client";

import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { toast } from "sonner";
import Camera from "@/shared/asset/svg/Camera";
import { TextButton } from "@/shared/ui/Button/TextButton";
import { useUploadProfileImage } from "@/features/profile-image/model/useUploadProfileImage";
import { getCroppedImage } from "@/features/profile-image/lib/getCroppedImage";

interface ProfileImageUploadModalProps {
  onClose: () => void;
}

export function ProfileImageUploadModal({
  onClose,
}: ProfileImageUploadModalProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const { mutate, isPending } = useUploadProfileImage();

  const handleDrop = (acceptedFiles: File[]) => {
    const nextFile = acceptedFiles[0];
    if (!nextFile) return;
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc(URL.createObjectURL(nextFile));
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: { "image/*": [] },
    multiple: false,
    disabled: isPending,
  });

  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [imageSrc]);

  const canSubmit = !!croppedAreaPixels && !isPending;

  const handleCropComplete = (_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  };

  const handleSubmit = () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const src = imageSrc;
    const area = croppedAreaPixels;

    void getCroppedImage(src, area)
      .then((cropped) => mutate(cropped, { onSuccess: onClose }))
      .catch(() => toast.error("이미지 처리에 실패했습니다."));
  };

  return (
    <div
      onClick={onClose}
      className="bg-background/50 fixed inset-0 z-100 flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-background-surface flex w-[90%] max-w-[448px] flex-col gap-3 rounded-2xl p-6"
      >
        <span className="text-text-1 text-main-text">프로필 사진 등록</span>

        {imageSrc ? (
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              objectFit="cover"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
          </div>
        ) : (
          <div
            {...getRootProps()}
            className="bg-background border-p-1 flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-dashed"
          >
            <input {...getInputProps()} />
            <Camera />
            <span className="text-text-4 text-sub-2">
              프로필 사진을 등록해보세요
            </span>
          </div>
        )}

        <div className="flex gap-2">
          <TextButton
            size="fit"
            variant="ghost"
            className="flex-1"
            onClick={onClose}
          >
            뒤로가기
          </TextButton>
          <TextButton
            size="fit"
            variant={canSubmit ? "filled" : "disabled"}
            className="flex-1"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            등록
          </TextButton>
        </div>
      </div>
    </div>
  );
}
