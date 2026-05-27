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

export interface ClubFormDraftState {
  title: string;
  description: string;
  fields: ClubFormFieldDraft[];
  nextFieldId: number;
  nextOptionId: number;
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

export function isClubFormFieldOptionValueValid(value: string) {
  const trimmedValue = value.trim();

  return !!trimmedValue && !trimmedValue.includes(",");
}

export function createDefaultClubFormField(id: number): ClubFormFieldDraft {
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

export function createDefaultClubFormDraftState(): ClubFormDraftState {
  return {
    title: "",
    description: "",
    fields: [createDefaultClubFormField(1)],
    nextFieldId: 2,
    nextOptionId: 1,
  };
}

export function createClubFormDraftState(form: ClubForm): ClubFormDraftState {
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
      Math.max(currentMax, ...field.options.map((option) => option.id)),
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

export type ClubFormDraftAction =
  | { type: "SET_TITLE"; value: string }
  | { type: "SET_DESCRIPTION"; value: string }
  | { type: "ADD_FIELD" }
  | { type: "REMOVE_FIELD"; fieldId: number }
  | {
      type: "SET_FIELD";
      fieldId: number;
      key: ClubFormFieldDraftKey;
      value: string | boolean;
    }
  | { type: "SET_FIELD_TYPE"; fieldId: number; fieldType: ClubFormFieldType }
  | { type: "ADD_OPTION"; fieldId: number }
  | { type: "REMOVE_OPTION"; fieldId: number; optionId: number }
  | {
      type: "SET_OPTION";
      fieldId: number;
      optionId: number;
      key: ClubFormFieldOptionDraftKey;
      value: string;
    };

export function clubFormDraftReducer(
  state: ClubFormDraftState,
  action: ClubFormDraftAction,
): ClubFormDraftState {
  switch (action.type) {
    case "SET_TITLE":
      return { ...state, title: action.value };
    case "SET_DESCRIPTION":
      return { ...state, description: action.value };
    case "ADD_FIELD":
      return {
        ...state,
        fields: [
          ...state.fields,
          createDefaultClubFormField(state.nextFieldId),
        ],
        nextFieldId: state.nextFieldId + 1,
      };
    case "REMOVE_FIELD":
      return {
        ...state,
        fields: state.fields.filter((field) => field.id !== action.fieldId),
      };
    case "SET_FIELD":
      return {
        ...state,
        fields: state.fields.map((field) =>
          field.id === action.fieldId
            ? { ...field, [action.key]: action.value }
            : field,
        ),
      };
    case "SET_FIELD_TYPE": {
      const shouldCreateOption = needsClubFormFieldOptions(action.fieldType);
      let didCreateOption = false;

      return {
        ...state,
        fields: state.fields.map((field) => {
          if (field.id !== action.fieldId) {
            return field;
          }

          if (!shouldCreateOption) {
            return { ...field, fieldType: action.fieldType, options: [] };
          }

          if (field.options.length > 0) {
            return {
              ...field,
              fieldType: action.fieldType,
              options: field.options,
            };
          }

          didCreateOption = true;

          return {
            ...field,
            fieldType: action.fieldType,
            options: [createDefaultClubFormFieldOption(state.nextOptionId)],
          };
        }),
        nextOptionId: didCreateOption
          ? state.nextOptionId + 1
          : state.nextOptionId,
      };
    }
    case "ADD_OPTION": {
      let didAddOption = false;

      return {
        ...state,
        fields: state.fields.map((field) => {
          if (field.id !== action.fieldId) {
            return field;
          }

          didAddOption = true;

          return {
            ...field,
            options: [
              ...field.options,
              createDefaultClubFormFieldOption(state.nextOptionId),
            ],
          };
        }),
        nextOptionId: didAddOption
          ? state.nextOptionId + 1
          : state.nextOptionId,
      };
    }
    case "REMOVE_OPTION":
      return {
        ...state,
        fields: state.fields.map((field) =>
          field.id === action.fieldId
            ? {
                ...field,
                options: field.options.filter(
                  (option) => option.id !== action.optionId,
                ),
              }
            : field,
        ),
      };
    case "SET_OPTION":
      return {
        ...state,
        fields: state.fields.map((field) =>
          field.id === action.fieldId
            ? {
                ...field,
                options: field.options.map((option) =>
                  option.id === action.optionId
                    ? { ...option, [action.key]: action.value }
                    : option,
                ),
              }
            : field,
        ),
      };
  }
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
