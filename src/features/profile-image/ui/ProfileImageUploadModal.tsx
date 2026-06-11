"use client";

import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { toast } from "sonner";
import Camera from "@/shared/asset/svg/Camera";
import Edit from "@/shared/asset/svg/Edit";
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
  const [isCropping, setIsCropping] = useState(false);
  const backdropMouseDownRef = useRef(false);
  const { mutate, isPending } = useUploadProfileImage();

  const handleDrop = (acceptedFiles: File[]) => {
    const nextFile = acceptedFiles[0];
    if (!nextFile) return;
    setImageSrc(URL.createObjectURL(nextFile));
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  const { getRootProps, getInputProps, open } = useDropzone({
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

  const canSubmit = !!croppedAreaPixels && !isPending && !isCropping;

  const handleCropComplete = (_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  };

  const handleBackdropMouseDown = (e: React.MouseEvent) => {
    backdropMouseDownRef.current = e.target === e.currentTarget;
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && backdropMouseDownRef.current) {
      onClose();
    }
  };

  const handleSubmit = () => {
    if (!imageSrc || !croppedAreaPixels || isCropping) return;
    setIsCropping(true);
    const src = imageSrc;
    const area = croppedAreaPixels;

    void getCroppedImage(src, area)
      .then((cropped) => mutate(cropped, { onSuccess: onClose }))
      .catch(() => toast.error("이미지 처리에 실패했습니다."))
      .finally(() => setIsCropping(false));
  };

  return (
    <div
      onMouseDown={handleBackdropMouseDown}
      onClick={handleBackdropClick}
      className="bg-background/50 fixed inset-0 z-100 flex items-center justify-center"
    >
      <div className="bg-background-surface flex w-[90%] max-w-[448px] flex-col gap-3 rounded-2xl p-6">
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
            <input {...getInputProps()} />
            <button
              type="button"
              onClick={open}
              aria-label="다른 사진 선택"
              className="bg-background-surface absolute top-2 right-2 z-20 flex size-9 cursor-pointer items-center justify-center rounded-full shadow-md [&_svg]:size-5"
            >
              <Edit color="var(--color-p-1)" />
            </button>
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
