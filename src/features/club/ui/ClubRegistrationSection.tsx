"use client";

import { useState } from "react";
import axios from "axios";
import FileOff from "@/shared/asset/svg/FileOff";
import TextField from "@/shared/ui/textField";
import { TextButton } from "@/shared/ui/Button/TextButton";
import ImageUpload from "@/shared/ui/ImageUpload";
import Great from "@/shared/asset/svg/Great";
import Back from "@/shared/asset/svg/Back";
import Search from "@/shared/asset/svg/Search";
import { useQuery } from "@tanstack/react-query";
import { usePostClub } from "@/entities/club/api/clubQueries";
import { userQueries } from "@/entities/user/api/userQueries";
import type { RegistrationData } from "@/entities/club/model/club";
import type { SearchUser } from "@/entities/user/model/user";
import { StudentSearch } from "@/entities/user/ui/StudentSearch";
import { SelectedStudent } from "@/entities/user/ui/SelectedStudent";
import { toast } from "sonner";

interface Props {
  onGoBackToList?: () => void;
}

export default function ClubRegistrationSection({ onGoBackToList }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<RegistrationData>({
    regType: null,
    clubType: "MAJOR_CLUB",
    clubName: "",
    status: "MAINTAIN",
    leaderInfo: "",
    clubDetail: "",
    desiredTeacher: "",
    clubImage: null,
  });
  const [memberName, setMemberName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<SearchUser[]>([]);

  const { mutateAsync: postClubAsync } = usePostClub();
  const { regType, clubName, leaderInfo, clubDetail } = formData;

  const { data: usersData } = useQuery({
    ...userQueries.list({ name: memberName || undefined }),
    enabled: memberName.trim().length > 0,
  });

  const selectedIds = new Set(selectedMembers.map((m) => m.id));
  const filteredMembers = (usersData?.content ?? []).filter(
    (user) => !selectedIds.has(user.id),
  );

  const handleChange = <K extends keyof RegistrationData>(
    key: K,
    value: RegistrationData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const isBasicFilled = !!(clubName && regType && leaderInfo && clubDetail);
  const canSubmit =
    isBasicFilled && (regType !== "NEW" || selectedMembers.length > 0);

  const handleSubmit = async () => {
    const requestBody = {
      name: clubName,
      type:
        regType === "NEW"
          ? ("MAJOR_CLUB" as const)
          : ("AUTONOMOUS_CLUB" as const),
      status: "MAINTAIN" as const,
      description: clubDetail,
      imageUrl: "",
      maxMember: selectedMembers.length || 1,
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

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-10 lg:flex-row">
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

      <div className="flex w-full flex-col lg:w-[330px]">
        <div className="flex flex-col gap-4 overflow-y-auto">
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
            <div className="flex w-full gap-1">
              <TextButton
                variant={regType === "NEW" ? "filled" : "outlined"}
                size="fit"
                className="flex-1"
                onClick={() => handleChange("regType", "NEW")}
              >
                신설
              </TextButton>
              <TextButton
                variant={regType === "MAINTAIN" ? "filled" : "outlined"}
                size="fit"
                className="flex-1"
                onClick={() => handleChange("regType", "MAINTAIN")}
              >
                유지
              </TextButton>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-text-3 font-medium">부장 이름/학번</span>
            <TextField
              placeholder="ex. 1101 김**"
              onChange={(e) => handleChange("leaderInfo", e.target.value)}
              value={leaderInfo}
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-text-3 font-medium">
              동아리 활동 내용 및 소개
            </span>
            <textarea
              placeholder="동아리 활동 내용 및 소개를 적어주세요"
              onChange={(e) => handleChange("clubDetail", e.target.value)}
              value={clubDetail}
              maxLength={500}
              className="border-sub-2 bg-background-surface text-main-text h-32 w-full resize-none rounded-lg border px-4 py-3 outline-none"
            />
            <span className="text-sub-2 text-right text-xs">
              {clubDetail.length}/500
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-text-3 font-medium">
              배정 희망 전공 선생님 (없으면 공란)
            </span>
            <TextField
              placeholder="희망 전공 선생님을 적어주세요"
              onChange={(e) => handleChange("desiredTeacher", e.target.value)}
              value={formData.desiredTeacher}
            />
          </div>

          {regType === "NEW" && (
            <div className="flex flex-col gap-2">
              <span className="text-text-3 font-medium">부원 추가</span>
              <div className="relative">
                <TextField
                  placeholder="이름, 학번을 입력해주세요"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  rightIcon={<Search />}
                />
                <div className="absolute top-full right-0 left-0 z-10 mt-1">
                  <StudentSearch
                    filteredStudents={filteredMembers}
                    isFull={false}
                    onSelect={(student) => {
                      setSelectedMembers((prev) => [...prev, student]);
                      setMemberName("");
                    }}
                  />
                </div>
              </div>
              <SelectedStudent
                selectedStudents={selectedMembers}
                onRemoveStudent={(num) =>
                  setSelectedMembers((prev) =>
                    prev.filter((s) => s.studentNumber !== num),
                  )
                }
              />
            </div>
          )}

          <ImageUpload
            onImageChange={(file) => handleChange("clubImage", file)}
          />

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
