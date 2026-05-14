"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import Club from "@/shared/asset/svg/Club";
import TextField from "@/shared/ui/textField";
import { TextButton } from "@/shared/ui/Button/TextButton";
import { clubQueries } from "@/entities/club/api/clubQueries";
import { userQueries } from "@/entities/user/api/userQueries";
import { createClubPermission } from "@/entities/user/lib/permission";
import {
  ClientQueryBoundary,
  type QueryErrorFallbackProps,
} from "@/shared/ui/QueryErrorBoundary";
import { Skeleton } from "@/shared/ui/Skeleton";
import { useClubFormBuilder } from "../model/useClubFormBuilder";
import { ClubBackButton } from "./ClubBackButton";
import { ClubFormFieldEditor } from "./ClubFormFieldEditor";

interface ClubFormCreateSectionProps {
  id: number;
}

const fieldBoxStyles =
  "w-full rounded-lg border border-sub-2 bg-background-surface px-4 py-3 text-main-text outline-none placeholder:text-sub-2 focus:border-sub-1 caret-p-1";

const secondaryButtonStyles =
  "h-[43px] rounded-lg border border-sub-2 bg-background-surface px-4 text-text-4 text-sub-1 hover:border-sub-1";

function ClubFormCreateSectionLoading() {
  return (
    <div className="flex min-h-0 w-full flex-1 overflow-y-auto sm:px-8 lg:px-8 xl:px-10 xl:pb-6 2xl:px-18">
      <div className="bg-background-surface flex h-fit min-h-0 w-full flex-col gap-6 rounded-2xl p-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-[52px] w-full max-w-4xl rounded-lg" />
        <Skeleton className="h-[160px] w-full max-w-4xl rounded-xl" />
      </div>
    </div>
  );
}

function ClubFormCreateSectionError({
  resetErrorBoundary,
}: QueryErrorFallbackProps) {
  return (
    <div className="flex min-h-0 w-full flex-1 overflow-y-auto sm:px-8 lg:px-8 xl:px-10 xl:pb-6 2xl:px-18">
      <div className="bg-background-surface flex h-[520px] min-h-0 w-full flex-col items-center justify-center gap-3 rounded-2xl p-6">
        <Club isActive={false} size={32} />
        <p className="text-text-1 text-main-text">
          동아리 정보를 불러오지 못했어요.
        </p>
        <div className="flex gap-3">
          <TextButton
            variant="outlined"
            size="fit"
            onClick={resetErrorBoundary}
          >
            다시 시도
          </TextButton>
        </div>
      </div>
    </div>
  );
}

const ClubFormCreateSection = ({ id }: ClubFormCreateSectionProps) => {
  const titleInputId = `club-form-title-${id}`;
  const descriptionInputId = `club-form-description-${id}`;
  const { data: detail } = useSuspenseQuery(clubQueries.detail(id));
  const { data: user } = useSuspenseQuery(userQueries.me());
  const isMajorClub = detail?.club.type === "MAJOR_CLUB";
  const clubPermission = createClubPermission({
    role: user?.role,
    clubType: detail?.club.type,
    isLeader: detail?.isLeader,
  });
  const {
    title,
    description,
    fields,
    canSubmit,
    handleTitleChange,
    handleDescriptionChange,
    handleAddField,
    handleRemoveField,
    handleFieldChange,
    handleFieldTypeChange,
    handleAddOption,
    handleRemoveOption,
    handleOptionChange,
    handleSubmit,
  } = useClubFormBuilder({
    clubId: id,
    canCreateForm: clubPermission.canCreateForm,
  });

  if (!clubPermission.canCreateForm) {
    return (
      <div className="flex min-h-0 w-full flex-1 overflow-y-auto sm:px-8 lg:px-8 xl:px-10 xl:pb-6 2xl:px-18">
        <div className="bg-background-surface flex h-[520px] min-h-0 w-full flex-col items-center justify-center gap-3 rounded-2xl p-6">
          <Club isActive={false} size={32} />
          <p className="text-text-1 text-main-text">
            {!isMajorClub
              ? "자율 동아리는 신청 폼을 만들 수 없어요."
              : "동아리 리더만 신청 폼을 만들 수 있어요."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 w-full flex-1 overflow-y-auto sm:px-8 lg:px-8 xl:px-10 xl:pb-6 2xl:px-18">
      <div className="bg-background-surface flex h-fit min-h-0 w-full flex-col gap-6 rounded-2xl p-6">
        <div className="flex items-center gap-2">
          <ClubBackButton />
          <span className="text-text-1 text-main-text">동아리 폼 만들기</span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto flex w-full max-w-4xl flex-col gap-6"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label
                htmlFor={titleInputId}
                className="text-text-3 text-main-text"
              >
                폼 제목 <span className="text-p-1">*</span>
              </label>
              <TextField
                id={titleInputId}
                value={title}
                placeholder="ex. 인력사무소 동아리 신청"
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor={descriptionInputId}
                className="text-text-3 text-main-text"
              >
                폼 설명
              </label>
              <textarea
                id={descriptionInputId}
                value={description}
                placeholder="신청자에게 보여줄 안내 문구를 입력해주세요"
                onChange={(e) => handleDescriptionChange(e.target.value)}
                className={`${fieldBoxStyles} min-h-[96px] resize-y`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {fields.map((field, index) => (
              <ClubFormFieldEditor
                key={field.id}
                field={field}
                index={index}
                isOnlyField={fields.length === 1}
                onRemoveField={handleRemoveField}
                onFieldChange={handleFieldChange}
                onFieldTypeChange={handleFieldTypeChange}
                onAddOption={handleAddOption}
                onRemoveOption={handleRemoveOption}
                onOptionChange={handleOptionChange}
              />
            ))}
          </div>

          <div className="flex flex-wrap justify-between gap-3">
            <button
              type="button"
              className={secondaryButtonStyles}
              onClick={handleAddField}
            >
              질문 추가
            </button>
            <div className="flex gap-3">
              <TextButton
                size="wide"
                type="submit"
                variant={canSubmit ? "filled" : "disabled"}
              >
                폼 생성하기
              </TextButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

ClubFormCreateSection.Loading = ClubFormCreateSectionLoading;
ClubFormCreateSection.Error = ClubFormCreateSectionError;

function ClubFormCreateSectionBoundary({ id }: ClubFormCreateSectionProps) {
  return (
    <ClientQueryBoundary
      loadingFallback={<ClubFormCreateSection.Loading />}
      errorFallback={ClubFormCreateSection.Error}
    >
      <ClubFormCreateSection id={id} />
    </ClientQueryBoundary>
  );
}

export { ClubFormCreateSection, ClubFormCreateSectionBoundary };
