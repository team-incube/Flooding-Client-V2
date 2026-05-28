import { z } from "zod";

/**
 * API 요청 이후 응답 본문이 비어있는지 검증하기 위해 사용합니다.
 */
export const axiosResponseSchema = z.object({
  status: z.number(),
  data: z.unknown(),
  config: z
    .object({
      url: z.string().optional(),
      method: z.string().optional(),
    })
    .catchall(z.unknown())
    .optional(),
});

/**
 * Tanstack Query Meta 옵션으로 Sentry 로깅 행위를 제어합니다.
 * feature/action은 mutationKey([feature, action])에서 추출합니다.
 */
export const mutationMonitorMetaSchema = z.object({
  getExtras: z
    .custom<
      (variables: unknown) => Record<string, unknown>
    >((val) => typeof val === "function")
    .optional(),
});

export function getMutationContext(
  mutationKey: unknown,
): { feature: string; action: string } | null {
  if (!Array.isArray(mutationKey)) return null;
  const [feature, action] = mutationKey;
  if (typeof feature !== "string" || typeof action !== "string") return null;
  return { feature, action };
}
