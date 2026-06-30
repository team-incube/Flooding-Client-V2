"use client";

import { useModelState } from "@/entities/ai/model/useModelState";

export function AiModelIndicator() {
  const modelState = useModelState();

  if (modelState.status === "idle") return null;

  const variantStyles = {
    loading: "text-sub-1",
    ready: "text-p-1",
    error: "text-negative",
  } as const;

  const label =
    modelState.status === "loading"
      ? `모델 로드 ${Math.round(modelState.progress * 100)}%`
      : modelState.status === "ready"
        ? "준비됨"
        : "미지원";

  return (
    <span
      className={`text-caption-2 whitespace-nowrap ${variantStyles[modelState.status]}`}
      title={modelState.status === "error" ? modelState.message : undefined}
    >
      {label}
    </span>
  );
}
