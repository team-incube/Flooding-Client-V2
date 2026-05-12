"use client";

import { useState } from "react";
import axios from "axios";
import FileOff from "@/shared/asset/svg/FileOff";
import TextField from "@/shared/ui/textField";
import { TextButton } from "@/shared/ui/Button/TextButton";
import Great from "@/shared/asset/svg/Great";
import Back from "@/shared/asset/svg/Back";
import { usePostClub } from "@/entities/club/api/clubQueries";
import type { RegistrationData } from "@/entities/club/model/club";
import { toast } from "sonner";

interface Props {
  onGoBackToList?: () => void;
  compact?: boolean;
}

export default function ClubRegistrationSection({
  onGoBackToList,
  compact = false,
}: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<RegistrationData>({
    name: "",
    type: "MAJOR_CLUB",
    status: "MAINTAIN",
    description: "",
    imageUrl: "",
    maxMember: 0,
  });

  const { mutateAsync: postClubAsync } = usePostClub();
  const { name, type, description, imageUrl, maxMember } = formData;

  const handleChange = <K extends keyof RegistrationData>(
    key: K,
    value: RegistrationData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const canSubmit = !!name.trim() && !!description.trim() && maxMember >= 0;

  const handleSubmit = async () => {
    const requestBody = {
      name,
      type,
      status: formData.status,
      description,
      imageUrl,
      maxMember,
    };

    const promise = postClubAsync(requestBody);

    toast.promise(promise, {
      loading: "동아리 개설 신청 중...",
      success: () => {
        setSubmitted(true);
        return "동아리 개설 신청에 성공했습니다.";
      },
      error: (err: unknown) => {
        if (axios.isAxiosError(err)) {
          return (
            err.response?.data?.message ?? "권한이 없거나 신청 기간이 아닙니다."
          );
        }
        return "권한이 없거나 신청 기간이 아닙니다.";
      },
    });
  };

  if (compact && submitted) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-4 py-12">
        <Great />
        <span className="text-sub-2 text-text-1 text-center">
          동아리 개설이 성공적으로 완료 되었습니다
        </span>
        <button
          onClick={onGoBackToList}
          className="text-text-1 text-sub-2 flex cursor-pointer items-center gap-2 underline hover:opacity-80"
        >
          돌아가기 <Back direction="right" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={
        compact
          ? "flex w-full flex-col"
          : "flex h-full min-h-0 flex-1 flex-col gap-10 lg:flex-row"
      }
    >
      {!compact && (
        <div className="flex h-[762px] min-h-0 flex-1 flex-col items-center justify-center">
          {!submitted ? (
            <>
              <FileOff />
              <span className="text-sub-2 text-text-1 mt-4">
                지금은 동아리 개설 기간입니다
              </span>
            </>
          ) : (
            <>
              <Great />
              <span className="text-sub-2 text-text-1 mt-4">
                동아리 개설이 성공적으로 완료 되었습니다
              </span>
              <button
                onClick={onGoBackToList}
                className="text-text-1 text-sub-2 mt-4 flex cursor-pointer items-center gap-2 underline hover:opacity-80"
              >
                돌아가기 <Back direction="right" />
              </button>
            </>
          )}
        </div>
      )}

      <div
        className={
          compact ? "flex w-full flex-col" : "flex w-full flex-col lg:w-[330px]"
        }
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-text-3">동아리명 (추후 변경 가능)</span>
            <TextField
              placeholder="동아리명을 적어주세요"
              onChange={(e) => handleChange("name", e.target.value)}
              value={name}
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-text-3">동아리 유형</span>
            <div className="flex w-full gap-1">
              <TextButton
                variant={type === "MAJOR_CLUB" ? "filled" : "outlined"}
                size="fit"
                className="flex-1"
                onClick={() => handleChange("type", "MAJOR_CLUB")}
              >
                정규
              </TextButton>
              <TextButton
                variant={type === "AUTONOMOUS_CLUB" ? "filled" : "outlined"}
                size="fit"
                className="flex-1"
                onClick={() => handleChange("type", "AUTONOMOUS_CLUB")}
              >
                자율
              </TextButton>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-text-3 font-medium">
              동아리 활동 내용 및 소개
            </span>
            <textarea
              placeholder="동아리 활동 내용 및 소개를 적어주세요"
              onChange={(e) => handleChange("description", e.target.value)}
              value={description}
              maxLength={500}
              className="border-sub-2 bg-background-surface text-main-text h-32 w-full resize-none rounded-lg border px-4 py-3 outline-none"
            />
            <span className="text-sub-2 text-right text-xs">
              {description.length}/500
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-text-3 font-medium">대표 이미지 URL</span>
            <TextField
              placeholder="이미지 URL을 입력해주세요"
              onChange={(e) => handleChange("imageUrl", e.target.value)}
              value={imageUrl}
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-text-3 font-medium">최대 인원</span>
            <TextField
              type="number"
              min={0}
              placeholder="최대 인원을 입력해주세요"
              onChange={(e) =>
                handleChange("maxMember", Number(e.target.value))
              }
              value={maxMember}
            />
          </div>

          <TextButton
            size="fit"
            className="w-full"
            variant={canSubmit ? "filled" : "disabled"}
            onClick={canSubmit ? handleSubmit : undefined}
          >
            {!submitted ? "동아리 신청" : "동아리 신청 수정하기"}
          </TextButton>
        </div>
      </div>
    </div>
  );
}
