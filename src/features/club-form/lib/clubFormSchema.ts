import { z } from "zod";
import { needsClubFormFieldOptions } from "./clubFormBuilder";

const clubFormFieldOptionDraftSchema = z.object({
  id: z.number(),
  label: z.string().trim().min(1, "선택지 표시 이름을 입력해주세요"),
  value: z
    .string()
    .trim()
    .min(1, "선택지 전송 값을 입력해주세요")
    .refine((value) => !value.includes(","), {
      message: "전송 값에는 쉼표(,)를 사용할 수 없어요",
    }),
});

export const clubFormFieldDraftSchema = z
  .object({
    id: z.number(),
    label: z.string().trim().min(1, "질문 제목을 입력해주세요"),
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
  title: z.string().trim().min(1, "폼 제목을 입력해주세요"),
  description: z.string(),
  fields: z.array(clubFormFieldDraftSchema).min(1, "질문을 추가해주세요"),
});
