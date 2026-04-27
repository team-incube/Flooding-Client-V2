import type {
  ClubForm,
  ClubFormFieldType,
  CreateClubFormRequest,
} from "@/entities/club/model/club";

export interface ClubFormFieldOptionDraft {
  id: number;
  label: string;
  value: string;
}

export interface ClubFormFieldDraft {
  id: number;
  label: string;
  description: string;
  fieldType: ClubFormFieldType;
  required: boolean;
  options: ClubFormFieldOptionDraft[];
}

export type ClubFormFieldDraftKey = keyof Omit<
  ClubFormFieldDraft,
  "id" | "options"
>;
export type ClubFormFieldOptionDraftKey = keyof Omit<
  ClubFormFieldOptionDraft,
  "id"
>;

export const clubFormFieldTypeOptions: {
  value: ClubFormFieldType;
  label: string;
}[] = [
  { value: "TEXT", label: "짧은 답변" },
  { value: "TEXTAREA", label: "긴 답변" },
  { value: "RADIO", label: "단일 선택" },
  { value: "CHECKBOX", label: "다중 선택" },
  { value: "DROPDOWN", label: "드롭다운" },
];

export function needsClubFormFieldOptions(fieldType: ClubFormFieldType) {
  return (
    fieldType === "RADIO" ||
    fieldType === "CHECKBOX" ||
    fieldType === "DROPDOWN"
  );
}

export function createDefaultClubFormField(
  id: number,
): ClubFormFieldDraft {
  return {
    id,
    label: "",
    description: "",
    fieldType: "TEXT",
    required: true,
    options: [],
  };
}

export function createDefaultClubFormFieldOption(
  id: number,
): ClubFormFieldOptionDraft {
  return {
    id,
    label: "",
    value: "",
  };
}

export function createClubFormDraftState(form: ClubForm) {
  const fields = form.fields
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((field, index) => ({
      id: index + 1,
      label: field.label,
      description: field.description ?? "",
      fieldType: field.fieldType,
      required: field.required,
      options: field.options.map((option, optionIndex) => ({
        id: optionIndex + 1,
        label: option.label,
        value: option.value,
      })),
    }));
  const maxOptionId = fields.reduce(
    (currentMax, field) =>
      Math.max(
        currentMax,
        ...field.options.map((option) => option.id),
      ),
    0,
  );

  return {
    title: form.title,
    description: form.description ?? "",
    fields,
    nextFieldId: fields.length + 1,
    nextOptionId: maxOptionId + 1,
  };
}

export function isClubFormFieldDraftValid(field: ClubFormFieldDraft) {
  if (!field.label.trim()) {
    return false;
  }

  if (!needsClubFormFieldOptions(field.fieldType)) {
    return true;
  }

  return (
    field.options.length > 0 &&
    field.options.every((option) => option.label.trim() && option.value.trim())
  );
}

export function createClubFormRequest({
  title,
  description,
  fields,
}: {
  title: string;
  description: string;
  fields: ClubFormFieldDraft[];
}): CreateClubFormRequest {
  return {
    title: title.trim(),
    description: description.trim() || undefined,
    fields: fields.map((field, index) => ({
      label: field.label.trim(),
      description: field.description.trim() || undefined,
      fieldType: field.fieldType,
      order: index + 1,
      required: field.required,
      options: needsClubFormFieldOptions(field.fieldType)
        ? field.options.map((option) => ({
            label: option.label.trim(),
            value: option.value.trim(),
          }))
        : [],
    })),
  };
}
