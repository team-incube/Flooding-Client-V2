"use client";

import { FormEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Club from "@/shared/asset/svg/Club";
import TextField from "@/shared/ui/textField";
import { TextButton } from "@/shared/ui/Button/TextButton";
import { clubQueries } from "@/entities/club/api/clubQueries";
import type { ClubFormField } from "@/entities/club/model/club";
import { useApplyClub } from "../model/useApplyClub";

interface ClubApplicationSectionProps {
  id: number;
}

type FieldValue = string | string[];
type FormValues = Record<number, FieldValue>;

const optionStyles = {
  selected: "border-p-1 bg-p-2 text-p-1",
  default: "border-sub-2 bg-background-surface text-sub-1",
};

const fieldContainerStyles = "flex flex-col gap-2";
const fieldLabelStyles = "text-text-3 text-main-text";
const fieldDescriptionStyles = "text-caption-1 text-sub-1";
const fieldBoxStyles =
  "w-full rounded-lg border border-sub-2 bg-background-surface px-4 py-3 text-main-text outline-none transition-all placeholder:text-sub-2 focus:border-sub-1 caret-p-1";

function hasFieldValue(value: FieldValue | undefined) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return !!value?.trim();
}

function normalizeAnswerValue(value: FieldValue | undefined) {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(",") : undefined;
  }

  return value?.trim() ? value : undefined;
}

interface ClubApplicationFieldProps {
  field: ClubFormField;
  value: FieldValue | undefined;
  onChange: (value: FieldValue) => void;
}

function ClubApplicationField({
  field,
  value,
  onChange,
}: ClubApplicationFieldProps) {
  const textValue = typeof value === "string" ? value : "";
  const selectedValues = Array.isArray(value) ? value : [];

  const toggleCheckbox = (optionValue: string) => {
    const nextValues = selectedValues.includes(optionValue)
      ? selectedValues.filter((selectedValue) => selectedValue !== optionValue)
      : [...selectedValues, optionValue];

    onChange(nextValues);
  };

  return (
    <div className={fieldContainerStyles}>
      <div className="flex flex-col gap-1">
        <label className={fieldLabelStyles}>
          {field.label}
          {field.required && <span className="text-p-1"> *</span>}
        </label>
        {field.description && (
          <p className={fieldDescriptionStyles}>{field.description}</p>
        )}
      </div>

      {field.fieldType === "TEXT" && (
        <TextField value={textValue} onChange={(e) => onChange(e.target.value)} />
      )}

      {field.fieldType === "TEXTAREA" && (
        <textarea
          value={textValue}
          onChange={(e) => onChange(e.target.value)}
          className={`${fieldBoxStyles} min-h-[120px] resize-none`}
        />
      )}

      {field.fieldType === "RADIO" && (
        <div className="flex flex-wrap gap-2">
          {field.options.map((option) => {
            const isSelected = textValue === option.value;
            const state = isSelected ? "selected" : "default";

            return (
              <label
                key={option.optionId}
                className={`flex h-[43px] cursor-pointer items-center justify-center rounded-lg border px-4 text-text-4 transition-all ${optionStyles[state]}`}
              >
                <input
                  type="radio"
                  name={`field-${field.fieldId}`}
                  value={option.value}
                  checked={isSelected}
                  onChange={() => onChange(option.value)}
                  className="sr-only"
                />
                {option.label}
              </label>
            );
          })}
        </div>
      )}

      {field.fieldType === "CHECKBOX" && (
        <div className="flex flex-wrap gap-2">
          {field.options.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            const state = isSelected ? "selected" : "default";

            return (
              <label
                key={option.optionId}
                className={`flex h-[43px] cursor-pointer items-center justify-center rounded-lg border px-4 text-text-4 transition-all ${optionStyles[state]}`}
              >
                <input
                  type="checkbox"
                  value={option.value}
                  checked={isSelected}
                  onChange={() => toggleCheckbox(option.value)}
                  className="sr-only"
                />
                {option.label}
              </label>
            );
          })}
        </div>
      )}

      {field.fieldType === "DROPDOWN" && (
        <select
          value={textValue}
          onChange={(e) => onChange(e.target.value)}
          className={`${fieldBoxStyles} h-[52px]`}
        >
          <option value="">선택해주세요</option>
          {field.options.map((option) => (
            <option key={option.optionId} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export function ClubApplicationSection({ id }: ClubApplicationSectionProps) {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>({});
  const applyMutation = useApplyClub(id);
  const { data: form, isLoading, isError } = useQuery(clubQueries.form(id));

  if (isLoading) {
    return (
      <div className="flex min-h-0 flex-1 w-full overflow-y-auto xl:px-10 xl:pb-6 2xl:px-18 lg:px-8 sm:px-8">
        <div className="flex h-fit min-h-0 w-full flex-col gap-6 rounded-2xl bg-background-surface p-6">
          <div className="h-6 w-40 animate-pulse rounded bg-sub-4" />
          <div className="h-5 w-80 animate-pulse rounded bg-sub-4" />
          <div className="flex max-w-3xl flex-col gap-5">
            <div className="h-[76px] w-full animate-pulse rounded-lg bg-sub-4" />
            <div className="h-[144px] w-full animate-pulse rounded-lg bg-sub-4" />
            <div className="h-[76px] w-full animate-pulse rounded-lg bg-sub-4" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !form) {
    return (
      <div className="flex min-h-0 flex-1 w-full overflow-y-auto xl:px-10 xl:pb-6 2xl:px-18 lg:px-8 sm:px-8">
        <div className="flex h-[520px] min-h-0 w-full flex-col items-center justify-center gap-3 rounded-2xl bg-background-surface p-6">
          <Club isActive={false} size={32} />
          <p className="text-text-1 text-main-text">
            활성화된 신청 폼이 없어요.
          </p>
        </div>
      </div>
    );
  }

  const fields = [...form.fields].sort((a, b) => a.order - b.order);
  const canSubmit =
    fields.every(
      (field) => !field.required || hasFieldValue(values[field.fieldId]),
    ) && !applyMutation.isPending;

  const handleFieldChange = (fieldId: number, value: FieldValue) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!canSubmit) {
      return;
    }

    applyMutation.mutate(
      {
        answers: fields.map((field) => ({
          fieldId: field.fieldId,
          value: normalizeAnswerValue(values[field.fieldId]),
        })),
      },
      {
        onSuccess: () => router.push(`/club/${id}`),
      },
    );
  };

  return (
    <div className="flex min-h-0 flex-1 w-full overflow-y-auto xl:px-10 xl:pb-6 2xl:px-18 lg:px-8 sm:px-8">
      <div className="flex h-fit min-h-0 w-full flex-col gap-6 rounded-2xl bg-background-surface p-6">
        <div className="flex items-center gap-2">
          <Club isActive={false} size={20} />
          <span className="text-text-1 text-main-text">동아리 신청</span>
        </div>

        <form onSubmit={handleSubmit} className="flex max-w-3xl flex-col gap-6">
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
