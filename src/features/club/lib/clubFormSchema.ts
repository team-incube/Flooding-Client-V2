import { z } from "zod";
import { needsClubFormFieldOptions } from "./clubFormBuilder";

const clubFormFieldOptionDraftSchema = z.object({
  id: z.number(),
  label: z.string().trim().min(1),
  value: z
    .string()
    .trim()
    .min(1)
    .refine((value) => !value.includes(",")),
});

export const clubFormFieldDraftSchema = z
  .object({
    id: z.number(),
    label: z.string().trim().min(1),
    description: z.string(),
    fieldType: z.enum(["TEXT", "TEXTAREA", "RADIO", "CHECKBOX", "DROPDOWN"]),
    required: z.boolean(),
    options: z.array(clubFormFieldOptionDraftSchema),
  })
  .superRefine((field, ctx) => {
    if (
      needsClubFormFieldOptions(field.fieldType) &&
      field.options.length === 0
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["options"],
        message: "선택형 질문에는 옵션이 필요합니다",
      });
    }
  });

export const clubFormDraftSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string(),
  fields: z.array(clubFormFieldDraftSchema).min(1),
});
