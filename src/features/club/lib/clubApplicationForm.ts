import type {
  ClubApplicationRequest,
  ClubFormField,
} from "@/entities/club/model/club";
export type ClubApplicationFieldValue = string | string[];
export type ClubApplicationFormValues = Record<
  string,
  ClubApplicationFieldValue
>;

export function getSortedClubFormFields(
  fields: ClubFormField[],
): ClubFormField[] {
  return [...fields].sort((a, b) => a.order - b.order);
}

export function normalizeClubApplicationAnswerValue(
  value: ClubApplicationFieldValue | undefined,
) {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(",") : undefined;
  }

  return value?.trim() ? value : undefined;
}

export function createClubApplicationRequest(
  fields: ClubFormField[],
  values: ClubApplicationFormValues,
): ClubApplicationRequest {
  return {
    answers: fields.map((field) => ({
      fieldId: field.fieldId,
      value: normalizeClubApplicationAnswerValue(values[String(field.fieldId)]),
    })),
  };
}
