"use client";

import { FormEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Club from "@/shared/asset/svg/Club";
import TextField from "@/shared/ui/textField";
import { TextButton } from "@/shared/ui/Button/TextButton";
import { clubQueries } from "@/entities/club/api/clubQueries";
import type {
  ClubFormFieldType,
  CreateClubFormRequest,
} from "@/entities/club/model/club";
import { useCreateClubForm } from "../model/useCreateClubForm";

interface ClubFormCreateSectionProps {
  id: number;
}

interface FieldOptionDraft {
  id: number;
  label: string;
  value: string;
}

interface FieldDraft {
  id: number;
  label: string;
  description: string;
  fieldType: ClubFormFieldType;
  required: boolean;
  options: FieldOptionDraft[];
}

const fieldTypeOptions: { value: ClubFormFieldType; label: string }[] = [
  { value: "TEXT", label: "짧은 답변" },
  { value: "TEXTAREA", label: "긴 답변" },
  { value: "RADIO", label: "단일 선택" },
  { value: "CHECKBOX", label: "다중 선택" },
  { value: "DROPDOWN", label: "드롭다운" },
];

const fieldBoxStyles =
  "w-full rounded-lg border border-sub-2 bg-background-surface px-4 py-3 text-main-text outline-none transition-all placeholder:text-sub-2 focus:border-sub-1 caret-p-1";

const secondaryButtonStyles =
  "h-[43px] rounded-lg border border-sub-2 bg-background-surface px-4 text-text-4 text-sub-1 transition-all hover:border-sub-1";

function requiresOptions(fieldType: ClubFormFieldType) {
  return (
    fieldType === "RADIO" ||
    fieldType === "CHECKBOX" ||
    fieldType === "DROPDOWN"
  );
}

function createDefaultField(id: number): FieldDraft {
  return {
    id,
    label: "",
    description: "",
    fieldType: "TEXT",
    required: true,
    options: [],
  };
}

function createDefaultOption(id: number): FieldOptionDraft {
  return {
    id,
    label: "",
    value: "",
  };
}

function isFieldValid(field: FieldDraft) {
  if (!field.label.trim()) {
    return false;
  }

  if (!requiresOptions(field.fieldType)) {
    return true;
  }

  return (
    field.options.length > 0 &&
    field.options.every((option) => option.label.trim() && option.value.trim())
  );
}

export function ClubFormCreateSection({ id }: ClubFormCreateSectionProps) {
  const router = useRouter();
  const createMutation = useCreateClubForm(id);
  const {
    data: detail,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useQuery(clubQueries.detail(id));
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<FieldDraft[]>([createDefaultField(1)]);
  const [nextFieldId, setNextFieldId] = useState(2);
  const [nextOptionId, setNextOptionId] = useState(1);
  const canCreateForm = detail?.club.type === "MAJOR_CLUB";

  const canSubmit =
    canCreateForm &&
    !!title.trim() &&
    fields.length > 0 &&
    fields.every(isFieldValid) &&
    !createMutation.isPending;

  const handleAddField = () => {
    setFields((prev) => [...prev, createDefaultField(nextFieldId)]);
    setNextFieldId((prev) => prev + 1);
  };

  const handleRemoveField = (fieldId: number) => {
    setFields((prev) => prev.filter((field) => field.id !== fieldId));
  };

  const handleFieldChange = (
    fieldId: number,
    key: keyof Omit<FieldDraft, "id" | "options">,
    value: string | boolean,
  ) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === fieldId ? { ...field, [key]: value } : field,
      ),
    );
  };

  const handleFieldTypeChange = (
    fieldId: number,
    fieldType: ClubFormFieldType,
  ) => {
    const optionId = nextOptionId;

    setFields((prev) =>
      prev.map((field) => {
        if (field.id !== fieldId) {
          return field;
        }

        if (!requiresOptions(fieldType)) {
          return { ...field, fieldType, options: [] };
        }

        return {
          ...field,
          fieldType,
          options:
            field.options.length > 0
              ? field.options
              : [createDefaultOption(optionId)],
        };
      }),
    );

    if (requiresOptions(fieldType)) {
      setNextOptionId((prev) => prev + 1);
    }
  };

  const handleAddOption = (fieldId: number) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === fieldId
          ? {
              ...field,
              options: [...field.options, createDefaultOption(nextOptionId)],
            }
          : field,
      ),
    );
    setNextOptionId((prev) => prev + 1);
  };

  const handleRemoveOption = (fieldId: number, optionId: number) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === fieldId
          ? {
              ...field,
              options: field.options.filter((option) => option.id !== optionId),
            }
          : field,
      ),
    );
  };

  const handleOptionChange = (
    fieldId: number,
    optionId: number,
    key: keyof Omit<FieldOptionDraft, "id">,
    value: string,
  ) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === fieldId
          ? {
              ...field,
              options: field.options.map((option) =>
                option.id === optionId ? { ...option, [key]: value } : option,
              ),
            }
          : field,
      ),
    );
  };

  const createRequestBody = (): CreateClubFormRequest => ({
    title: title.trim(),
    description: description.trim() || undefined,
    fields: fields.map((field, index) => ({
      label: field.label.trim(),
      description: field.description.trim() || undefined,
      fieldType: field.fieldType,
      order: index + 1,
      required: field.required,
      options: requiresOptions(field.fieldType)
        ? field.options.map((option) => ({
            label: option.label.trim(),
            value: option.value.trim(),
          }))
        : [],
    })),
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!canSubmit) {
      return;
    }

    createMutation.mutate(createRequestBody(), {
      onSuccess: () => router.push(`/club/${id}/apply`),
    });
  };

  if (isDetailLoading) {
    return (
      <div className="flex min-h-0 flex-1 w-full overflow-y-auto xl:px-10 xl:pb-6 2xl:px-18 lg:px-8 sm:px-8">
        <div className="flex h-fit min-h-0 w-full flex-col gap-6 rounded-2xl bg-background-surface p-6">
          <div className="h-6 w-40 animate-pulse rounded bg-sub-4" />
          <div className="h-[52px] max-w-4xl animate-pulse rounded-lg bg-sub-4" />
          <div className="h-[160px] max-w-4xl animate-pulse rounded-xl bg-sub-4" />
        </div>
      </div>
    );
  }

  if (isDetailError || !detail) {
    return (
      <div className="flex min-h-0 flex-1 w-full overflow-y-auto xl:px-10 xl:pb-6 2xl:px-18 lg:px-8 sm:px-8">
        <div className="flex h-[520px] min-h-0 w-full flex-col items-center justify-center gap-3 rounded-2xl bg-background-surface p-6">
          <Club isActive={false} size={32} />
          <p className="text-text-1 text-main-text">
            존재하지 않는 동아리입니다.
          </p>
        </div>
      </div>
    );
  }

  if (!canCreateForm) {
    return (
      <div className="flex min-h-0 flex-1 w-full overflow-y-auto xl:px-10 xl:pb-6 2xl:px-18 lg:px-8 sm:px-8">
        <div className="flex h-[520px] min-h-0 w-full flex-col items-center justify-center gap-3 rounded-2xl bg-background-surface p-6">
          <Club isActive={false} size={32} />
          <p className="text-text-1 text-main-text">
            자율 동아리는 신청 폼을 만들 수 없어요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 w-full overflow-y-auto xl:px-10 xl:pb-6 2xl:px-18 lg:px-8 sm:px-8">
      <div className="flex h-fit min-h-0 w-full flex-col gap-6 rounded-2xl bg-background-surface p-6">
        <div className="flex items-center gap-2">
          <Club isActive={false} size={20} />
          <span className="text-text-1 text-main-text">동아리 폼 만들기</span>
        </div>

        <form onSubmit={handleSubmit} className="flex max-w-4xl flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-text-3 text-main-text">
                폼 제목 <span className="text-p-1">*</span>
              </label>
              <TextField
                value={title}
                placeholder="ex. 인력사무소 동아리 신청"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-text-3 text-main-text">폼 설명</label>
              <textarea
                value={description}
                placeholder="신청자에게 보여줄 안내 문구를 입력해주세요"
                onChange={(e) => setDescription(e.target.value)}
                className={`${fieldBoxStyles} min-h-[96px] resize-none`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-col gap-4 rounded-xl border border-sub-3 bg-background p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-text-1 text-main-text">
                    질문 {index + 1}
                  </span>
                  <button
                    type="button"
                    className={secondaryButtonStyles}
                    onClick={() => handleRemoveField(field.id)}
                    disabled={fields.length === 1}
                  >
                    삭제
                  </button>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1fr_180px]">
                  <div className="flex flex-col gap-1">
                    <label className="text-text-3 text-main-text">
                      질문 제목 <span className="text-p-1">*</span>
                    </label>
                    <TextField
                      value={field.label}
                      placeholder="질문을 입력해주세요"
                      onChange={(e) =>
                        handleFieldChange(field.id, "label", e.target.value)
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-text-3 text-main-text">
                      질문 타입
                    </label>
                    <select
                      value={field.fieldType}
                      onChange={(e) =>
                        handleFieldTypeChange(
                          field.id,
                          e.target.value as ClubFormFieldType,
                        )
                      }
                      className={`${fieldBoxStyles} h-[52px]`}
                    >
                      {fieldTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-text-3 text-main-text">질문 설명</label>
                  <TextField
                    value={field.description}
                    placeholder="선택 입력"
                    onChange={(e) =>
                      handleFieldChange(
                        field.id,
                        "description",
                        e.target.value,
                      )
                    }
                  />
                </div>

                <label className="flex w-fit cursor-pointer items-center gap-2 text-text-4 text-sub-1">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) =>
                      handleFieldChange(field.id, "required", e.target.checked)
                    }
                    className="size-4 accent-p-1"
                  />
                  필수 질문
                </label>

                {requiresOptions(field.fieldType) && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-text-3 text-main-text">
                        선택지 <span className="text-p-1">*</span>
                      </span>
                      <button
                        type="button"
                        className={secondaryButtonStyles}
                        onClick={() => handleAddOption(field.id)}
                      >
                        선택지 추가
                      </button>
                    </div>

                    <div className="flex flex-col gap-2">
                      {field.options.map((option) => (
                        <div
                          key={option.id}
                          className="grid gap-2 lg:grid-cols-[1fr_1fr_auto]"
                        >
                          <TextField
                            value={option.label}
                            placeholder="표시 이름"
                            onChange={(e) =>
                              handleOptionChange(
                                field.id,
                                option.id,
                                "label",
                                e.target.value,
                              )
                            }
                          />
                          <TextField
                            value={option.value}
                            placeholder="전송 값"
                            onChange={(e) =>
                              handleOptionChange(
                                field.id,
                                option.id,
                                "value",
                                e.target.value,
                              )
                            }
                          />
                          <button
                            type="button"
                            className={secondaryButtonStyles}
                            onClick={() =>
                              handleRemoveOption(field.id, option.id)
                            }
                            disabled={field.options.length === 1}
                          >
                            삭제
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
              폼 생성하기
            </TextButton>
          </div>
        </form>
      </div>
    </div>
  );
}
