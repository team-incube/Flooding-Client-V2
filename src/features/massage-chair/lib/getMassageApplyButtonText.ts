interface GetMassageApplyButtonTextParams {
  isLoading: boolean;
  hasApplied: boolean;
  isApplicationOpen: boolean;
}

export function getMassageApplyButtonText({
  isLoading,
  hasApplied,
  isApplicationOpen,
}: GetMassageApplyButtonTextParams): string {
  if (isLoading) return "확인 중";
  if (hasApplied) return "취소";
  if (isApplicationOpen) return "신청 불가";
  return "신청";
}
