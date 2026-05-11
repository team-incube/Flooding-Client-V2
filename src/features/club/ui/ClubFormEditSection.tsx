"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import Club from "@/shared/asset/svg/Club";
import TextField from "@/shared/ui/textField";
import { TextButton } from "@/shared/ui/Button/TextButton";
import { clubQueries } from "@/entities/club/api/clubQueries";
import { userQueries } from "@/entities/user/api/userQueries";
import type { ClubForm } from "@/entities/club/model/club";
import {
  ClientQueryBoundary,
  type QueryErrorFallbackProps,
} from "@/shared/ui/QueryErrorBoundary";
import { Skeleton } from "@/shared/ui/Skeleton";
import { useClubFormBuilder } from "../model/useClubFormBuilder";
import { ClubFormFieldEditor } from "./ClubFormFieldEditor";

interface ClubFormEditSectionProps {
  id: number;
}

const fieldBoxStyles =
  "w-full rounded-lg border border-sub-2 bg-background-surface px-4 py-3 text-main-text outline-none placeholder:text-sub-2 focus:border-sub-1 caret-p-1";

const secondaryButtonStyles =
  "h-[43px] rounded-lg border border-sub-2 bg-background-surface px-4 text-text-4 text-sub-1 hover:border-sub-1";

interface ClubFormEditContentProps extends ClubFormEditSectionProps {
  form: ClubForm;
}

function ClubFormEditContent({ id, form }: ClubFormEditContentProps) {
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
    canCreateForm: true,
    mode: "edit",
    initialForm: form,
  });

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-4xl flex-col gap-6"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label
            htmlFor={`club-form-edit-title-${id}`}
            className="text-text-3 text-main-text"
          >
            폼 제목 <span className="text-p-1">*</span>
          </label>
          <TextField
            id={`club-form-edit-title-${id}`}
            value={title}
            placeholder="ex. 인력사무소 동아리 신청"
            onChange={(e) => handleTitleChange(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor={`club-form-edit-description-${id}`}
            className="text-text-3 text-main-text"
          >
            폼 설명
          </label>
          <textarea
            id={`club-form-edit-description-${id}`}
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
        <TextButton
          size="wide"
          variant={canSubmit ? "filled" : "disabled"}
          className="max-w-full"
        >
          폼 수정하기
        </TextButton>
      </div>
    </form>
  );
}

function ClubFormEditSectionLoading() {
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

function ClubFormEditSectionError({
  resetErrorBoundary,
}: QueryErrorFallbackProps) {
  return (
    <div className="flex min-h-0 w-full flex-1 overflow-y-auto sm:px-8 lg:px-8 xl:px-10 xl:pb-6 2xl:px-18">
      <div className="bg-background-surface flex h-[520px] min-h-0 w-full flex-col items-center justify-center gap-3 rounded-2xl p-6">
        <Club isActive={false} size={32} />
        <p className="text-text-1 text-main-text">
          동아리 신청 폼을 불러오지 못했어요.
        </p>
        <TextButton variant="outlined" size="fit" onClick={resetErrorBoundary}>
          다시 시도
        </TextButton>
      </div>
    </div>
  );
}

function ClubFormEditSectionEmpty() {
  return (
    <div className="flex min-h-0 w-full flex-1 overflow-y-auto sm:px-8 lg:px-8 xl:px-10 xl:pb-6 2xl:px-18">
      <div className="bg-background-surface flex h-[520px] min-h-0 w-full flex-col items-center justify-center gap-3 rounded-2xl p-6">
        <Club isActive={false} size={32} />
        <p className="text-text-1 text-main-text">수정할 신청 폼이 없어요.</p>
      </div>
    </div>
  );
}

const ClubFormEditSection = ({ id }: ClubFormEditSectionProps) => {
  const { data: detail } = useSuspenseQuery(clubQueries.detail(id));
  const { data: form } = useSuspenseQuery({
    ...clubQueries.form(id),
    retry: false,
  });
  const { data: user } = useSuspenseQuery(userQueries.me());
  const isMajorClub = detail?.club.type === "MAJOR_CLUB";
  const isLeader = !!user && user.name === detail?.club.leader;
  const canEditForm = !!detail && isMajorClub && isLeader;

  if (!canEditForm) {
    return (
      <div className="flex min-h-0 w-full flex-1 overflow-y-auto sm:px-8 lg:px-8 xl:px-10 xl:pb-6 2xl:px-18">
        <div className="bg-background-surface flex h-[520px] min-h-0 w-full flex-col items-center justify-center gap-3 rounded-2xl p-6">
          <Club isActive={false} size={32} />
          <p className="text-text-1 text-main-text">
            {!isMajorClub
              ? "자율 동아리는 신청 폼을 수정할 수 없어요."
              : "동아리 리더만 신청 폼을 수정할 수 있어요."}
          </p>
        </div>
      </div>
    );
  }

  if (!form) {
    return <ClubFormEditSection.Empty />;
  }

  return (
    <div className="flex min-h-0 w-full flex-1 overflow-y-auto sm:px-8 lg:px-8 xl:px-10 xl:pb-6 2xl:px-18">
      <div className="bg-background-surface flex h-fit min-h-0 w-full flex-col gap-6 rounded-2xl p-6">
        <div className="flex items-center gap-2">
          <Club isActive={false} size={20} />
          <span className="text-text-1 text-main-text">동아리 폼 수정</span>
        </div>

        <ClubFormEditContent id={id} form={form} />
      </div>
    </div>
  );
};

ClubFormEditSection.Loading = ClubFormEditSectionLoading;
ClubFormEditSection.Error = ClubFormEditSectionError;
ClubFormEditSection.Empty = ClubFormEditSectionEmpty;

function ClubFormEditSectionBoundary({ id }: ClubFormEditSectionProps) {
  return (
    <ClientQueryBoundary
      loadingFallback={<ClubFormEditSection.Loading />}
      errorFallback={ClubFormEditSection.Error}
    >
      <ClubFormEditSection id={id} />
    </ClientQueryBoundary>
  );
}

export { ClubFormEditSection, ClubFormEditSectionBoundary };
