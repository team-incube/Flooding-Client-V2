"use client";

import { useQuery } from "@tanstack/react-query";
import Club from "@/shared/asset/svg/Club";
import { TextButton } from "@/shared/ui/Button/TextButton";
import { clubQueries } from "@/entities/club/api/clubQueries";
import { useClubApplicationForm } from "../model/useClubApplicationForm";
import { ClubApplicationField } from "./ClubApplicationField";

interface ClubApplicationSectionProps {
  id: number;
}

export function ClubApplicationSection({ id }: ClubApplicationSectionProps) {
  const { data: form, isLoading, isError } = useQuery(clubQueries.form(id));
  const { fields, values, canSubmit, handleFieldChange, handleSubmit } =
    useClubApplicationForm({
      clubId: id,
      fields: form?.fields ?? [],
    });

  if (isLoading) {
    return (
      <div className="flex min-h-0 w-full flex-1 overflow-y-auto sm:px-8 lg:px-8 xl:px-10 xl:pb-6 2xl:px-18">
        <div className="bg-background-surface flex h-fit min-h-0 w-full flex-col gap-6 rounded-2xl p-6">
          <div className="bg-sub-4 h-6 w-40 animate-pulse rounded" />
          <div className="bg-sub-4 h-5 w-80 animate-pulse rounded" />
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
            <div className="bg-sub-4 h-[76px] w-full animate-pulse rounded-lg" />
            <div className="bg-sub-4 h-[144px] w-full animate-pulse rounded-lg" />
            <div className="bg-sub-4 h-[76px] w-full animate-pulse rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !form) {
    return (
      <div className="flex min-h-0 w-full flex-1 overflow-y-auto sm:px-8 lg:px-8 xl:px-10 xl:pb-6 2xl:px-18">
        <div className="bg-background-surface flex h-[520px] min-h-0 w-full flex-col items-center justify-center gap-3 rounded-2xl p-6">
          <Club isActive={false} size={32} />
          <p className="text-text-1 text-main-text">
            활성화된 신청 폼이 없어요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 w-full flex-1 overflow-y-auto sm:px-8 lg:px-8 xl:px-10 xl:pb-6 2xl:px-18">
      <div className="bg-background-surface flex h-fit min-h-0 w-full flex-col gap-6 rounded-2xl p-6">
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
}
