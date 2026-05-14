interface GetMassageApplyButtonTextParams {
  isLoading: boolean;
  hasApplied: boolean;
  isApplicationOpen: boolean;
  isApplicationTime?: boolean;
}

export function getMassageApplyButtonText({
  isLoading,
  hasApplied,
  isApplicationOpen,
  isApplicationTime = true,
}: GetMassageApplyButtonTextParams): string {
  if (isLoading) return "확인 중";
  if (hasApplied) return "취소";
  if (isApplicationOpen || !isApplicationTime) return "신청 불가";
  return "신청";
}
