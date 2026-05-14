import type { TextButtonVariant } from "@/shared/ui/Button/TextButton";

interface GetStudyApplyButtonStateParams {
  isStudyBanned: boolean;
  isActionDisabled: boolean;
  isLoading: boolean;
  hasApplied: boolean;
  isApplicationOpen: boolean;
}

interface StudyApplyButtonState {
  text: string;
  variant: TextButtonVariant;
}

export function getStudyApplyButtonState({
  isStudyBanned,
  isActionDisabled,
  isLoading,
  hasApplied,
  isApplicationOpen,
}: GetStudyApplyButtonStateParams): StudyApplyButtonState {
  const variant: TextButtonVariant = isStudyBanned
    ? "negative"
    : isActionDisabled
      ? "disabled"
      : "filled";

  const text = isStudyBanned
    ? "자습 금지를 당했어요!"
    : isLoading
      ? "확인 중"
      : hasApplied
        ? "취소하기"
        : isApplicationOpen
          ? "신청 불가"
          : "신청하기";

  return { text, variant };
}
