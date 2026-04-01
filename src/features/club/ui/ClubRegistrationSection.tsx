"use client";

import { useMemo, useState } from "react";
import FileOff from "@/shared/asset/svg/FileOff";
import TextField from "@/shared/ui/textField";
import { TextButton } from "@/shared/ui/Button/TextButton";
import ImageUpload from "@/shared/ui/ImageUpload";
import Great from "@/shared/asset/svg/Great";

interface Props {
  isSubmitted?: boolean;
}

interface RegistrationData {
  regType: "NEW" | "MAINTAIN" | null;
  clubType: "MAJOR_CLUB" | "AUTONOMOUS_CLUB";
  status: "ACTIVE" | "ABOLISHED";
  clubName: string;
  leaderInfo: string;
  clubDetail: string;
  desiredTeacher: string;
  memberCount: string;
  clubImage: File | string | null;
}

const initialFormState: RegistrationData = {
  regType: null,
  clubType: "MAJOR_CLUB",
  clubName: "",
  status: "ACTIVE",
  leaderInfo: "",
  clubDetail: "",
  desiredTeacher: "",
  memberCount: "",
  clubImage: null,
};

const isFileEqual = (f1: File | string | null, f2: File | string | null) => {
  if (f1 === f2) return true;

  if (f1 instanceof File && f2 instanceof File) {
    return (
      f1.name === f2.name &&
      f1.size === f2.size &&
      f1.lastModified === f2.lastModified
    );
  }

  return false;
};

export default function ClubRegistrationSection({
  isSubmitted = false,
}: Props) {
  const [submitted, setSubmitted] = useState(isSubmitted);
  const [formData, setFormData] = useState<RegistrationData>(initialFormState);
  const [initialData, setInitialData] = useState<RegistrationData | null>(null);

  const {
    regType,
    clubName,
    clubType,
    leaderInfo,
    clubDetail,
    desiredTeacher,
    memberCount,
    clubImage,
  } = formData;

  const handleChange = (
    key: keyof RegistrationData,
    value: RegistrationData[keyof RegistrationData],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const canSubmit = useMemo(() => {
    const isBasicFilled = !!(clubName && clubType && leaderInfo && clubDetail);

    if (regType === "NEW") return isBasicFilled && !!memberCount;
    return isBasicFilled;
  }, [clubName, clubType, leaderInfo, clubDetail, memberCount, regType]);

  const isChanged = useMemo(() => {
    if (!initialData) return false;

    const fieldsToCompare: (keyof RegistrationData)[] = [
      "regType",
      "clubName",
      "clubType",
      "leaderInfo",
      "clubDetail",
      "desiredTeacher",
      "memberCount",
    ];

    const isFieldChanged = fieldsToCompare.some(
      (key) => formData[key] !== initialData[key],
    );

    const isImageChanged = !isFileEqual(
      formData.clubImage,
      initialData.clubImage,
    );
    return isFieldChanged || isImageChanged;
  }, [formData, initialData]);

  const handleSubmit = () => {
    setSubmitted(true);
    setInitialData({ ...formData });
  };

  const isActionable = !submitted ? canSubmit : isChanged;

  return (
    <div className="flex gap-10 h-full min-h-0 flex-1 flex-col lg:flex-row">
      {!submitted ? (
        <div className="flex flex-1 flex-col h-[762px] items-center justify-center min-h-0">
          <FileOff />
          <span className="text-sub-2 text-text-1 mt-4">
            지금은 동아리 개설 기간입니다
          </span>
        </div>
      ) : (
        <div className="flex flex-1 flex-col h-[762px] items-center justify-center min-h-0">
          <Great />
          <span className="text-sub-2 text-text-1 mt-4">
            동아리 개설이 성공적으로 완료 되었습니다
          </span>
        </div>
      )}

      <div className="flex w-full flex-col lg:w-[330px]">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-text-3">동아리명 (추후 변경 가능)</span>
            <TextField
              placeholder="동아리명을 적어주세요"
              onChange={(e) => handleChange("clubName", e.target.value)}
              value={clubName}
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-text-3">유지, 신설 여부</span>
            <div className="flex gap-1 w-full">
              <TextButton
                variant={regType === "NEW" ? "filled" : "outlined"}
                size="wide"
                onClick={() =>
                  handleChange("regType", regType === "NEW" ? null : "NEW")
                }
              >
                신설
              </TextButton>
              <TextButton
                variant={regType === "MAINTAIN" ? "filled" : "outlined"}
                size="wide"
                onClick={() =>
                  handleChange(
                    "regType",
                    regType === "MAINTAIN" ? null : "MAINTAIN",
                  )
                }
              >
                유지
              </TextButton>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-text-3">부장 이름/학번 </span>
            <TextField
              placeholder="ex. 1101 김**"
              onChange={(e) => handleChange("leaderInfo", e.target.value)}
              value={leaderInfo}
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-text-3">동아리 활동 내용 및 소개</span>
            <textarea
              placeholder="동아리 활동 내용 및 소개를 적어주세요"
              onChange={(e) => handleChange("clubDetail", e.target.value)}
              maxLength={200}
              value={clubDetail}
              className="w-full h-[52px] rounded-lg border border-sub-2 bg-background-surface text-main-text placeholder:text-sub-2 focus:border-sub-1 outline-none py-3 px-4 resize-none caret-p-1 transition-all"
            />
            <span className="text-xs text-right text-sub-2">
              {clubDetail.length}/200
            </span>
          </div>

          {regType === "NEW" && (
            <>
              <div className="flex flex-col gap-1">
                <span className="text-text-3">
                  배정 희망 전공 선생님 (없으면 공란)
                </span>
                <TextField
                  placeholder="배정 희망 전공 선생님을 적어주세요"
                  onChange={(e) =>
                    handleChange("desiredTeacher", e.target.value)
                  }
                  value={desiredTeacher}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-text-3">현재 모인 대략적인 인원</span>
                <TextField
                  type="number"
                  placeholder="대략적 인원을 적어주세요"
                  onChange={(e) => handleChange("memberCount", e.target.value)}
                  value={memberCount}
                />
              </div>
            </>
          )}

          <div className="flex flex-col gap-2">
            <ImageUpload
              onImageChange={(file) => handleChange("clubImage", file)}
            />
          </div>

          <TextButton
            size="wide"
            variant={isActionable ? "filled" : "disabled"}
            onClick={isActionable ? handleSubmit : undefined}
          >
            {!submitted ? "동아리 신청" : "동아리 신청 수정하기"}
          </TextButton>
        </div>
      </div>
    </div>
  );
}
