import { z } from "zod";
import type { ClubFormField } from "@/entities/club/model/club";

const clubApplicationFieldValueSchema = z.union([
  z.string(),
  z.array(z.string()),
]);

export function createClubApplicationSchema(fields: ClubFormField[]) {
  return z
    .record(z.string(), clubApplicationFieldValueSchema)
    .superRefine((values, ctx) => {
      fields.forEach((field) => {
        if (!field.required) return;

        const value = values[String(field.fieldId)];
        const hasValue = Array.isArray(value)
          ? value.length > 0
          : !!value?.trim();

        if (!hasValue) {
          ctx.addIssue({
            code: "custom",
            path: [String(field.fieldId)],
            message: "필수 질문입니다",
          });
        }
      });
    });
}
