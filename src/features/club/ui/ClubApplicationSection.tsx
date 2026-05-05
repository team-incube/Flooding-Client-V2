"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import Club from "@/shared/asset/svg/Club";
import { TextButton } from "@/shared/ui/Button/TextButton";
import { clubQueries } from "@/entities/club/api/clubQueries";
import {
  ClientQueryBoundary,
  type QueryErrorFallbackProps,
} from "@/shared/ui/QueryErrorBoundary";
import { Skeleton } from "@/shared/ui/Skeleton";
import { useClubApplicationForm } from "../model/useClubApplicationForm";
import { ClubApplicationField } from "./ClubApplicationField";

interface ClubApplicationSectionProps {
  id: number;
}

function ClubApplicationSectionLoading() {
  return (
    <div className="flex min-h-0 flex-1 w-full overflow-y-auto xl:px-10 xl:pb-6 2xl:px-18 lg:px-8 sm:px-8">
      <div className="flex h-fit min-h-0 w-full flex-col gap-6 rounded-2xl bg-background-surface p-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-5 w-80" />
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
          <Skeleton className="h-[76px] w-full rounded-lg" />
          <Skeleton className="h-[144px] w-full rounded-lg" />
          <Skeleton className="h-[76px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function ClubApplicationSectionError({
  resetErrorBoundary,
}: QueryErrorFallbackProps) {
  return (
    <div className="flex min-h-0 flex-1 w-full overflow-y-auto xl:px-10 xl:pb-6 2xl:px-18 lg:px-8 sm:px-8">
      <div className="flex h-[520px] min-h-0 w-full flex-col items-center justify-center gap-3 rounded-2xl bg-background-surface p-6">
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

function ClubApplicationSectionEmpty() {
  return (
    <div className="flex min-h-0 flex-1 w-full overflow-y-auto xl:px-10 xl:pb-6 2xl:px-18 lg:px-8 sm:px-8">
      <div className="flex h-[520px] min-h-0 w-full flex-col items-center justify-center gap-3 rounded-2xl bg-background-surface p-6">
        <Club isActive={false} size={32} />
        <p className="text-text-1 text-main-text">활성화된 신청 폼이 없어요.</p>
      </div>
    </div>
  );
}

const ClubApplicationSection = ({ id }: ClubApplicationSectionProps) => {
  const { data: form } = useSuspenseQuery(clubQueries.form(id));
  const { fields, values, canSubmit, handleFieldChange, handleSubmit } =
    useClubApplicationForm({
      clubId: id,
      fields: form?.fields ?? [],
    });

  if (!form) {
    return <ClubApplicationSection.Empty />;
  }

  return (
    <div className="flex min-h-0 flex-1 w-full overflow-y-auto xl:px-10 xl:pb-6 2xl:px-18 lg:px-8 sm:px-8">
      <div className="flex h-fit min-h-0 w-full flex-col gap-6 rounded-2xl bg-background-surface p-6">
        <div className="flex items-center gap-2">
          <Club isActive={false} size={20} />
          <span className="text-text-1 text-main-text">동아리 신청</span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto flex w-full max-w-3xl flex-col gap-6"
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-title-2 text-main-text">{form.title}</h1>
            {form.description && (
              <p className="text-text-3 text-sub-1">{form.description}</p>
            )}
          </div>

          <div className="flex flex-col gap-5">
            {fields.map((field) => (
              <ClubApplicationField
                key={field.fieldId}
                field={field}
                value={values[field.fieldId]}
                onChange={(value) => handleFieldChange(field.fieldId, value)}
              />
            ))}
          </div>

          <div className="flex justify-end">
            <TextButton
              size="wide"
              variant={canSubmit ? "filled" : "disabled"}
              className="max-w-full"
            >
              신청하기
            </TextButton>
          </div>
        </form>
      </div>
    </div>
  );
};

ClubApplicationSection.Loading = ClubApplicationSectionLoading;
ClubApplicationSection.Error = ClubApplicationSectionError;
ClubApplicationSection.Empty = ClubApplicationSectionEmpty;

function ClubApplicationSectionBoundary({ id }: ClubApplicationSectionProps) {
  return (
    <ClientQueryBoundary
      loadingFallback={<ClubApplicationSection.Loading />}
      errorFallback={ClubApplicationSection.Error}
    >
      <ClubApplicationSection id={id} />
    </ClientQueryBoundary>
  );
}

export { ClubApplicationSection, ClubApplicationSectionBoundary };
