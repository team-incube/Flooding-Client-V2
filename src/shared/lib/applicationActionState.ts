interface CreateApplicationActionStateParams {
  hasApplied: boolean;
  isUserLoading: boolean;
  isDataLoading: boolean;
  isActionPending: boolean;
  isApplicationOpen: boolean;
  isApplicationTime?: boolean;
  isBanned?: boolean;
}

export function createApplicationActionState({
  hasApplied,
  isUserLoading,
  isDataLoading,
  isActionPending,
  isApplicationOpen,
  isApplicationTime = true,
  isBanned = false,
}: CreateApplicationActionStateParams) {
  const isApplyDisabled =
    isUserLoading ||
    isDataLoading ||
    isBanned ||
    isActionPending ||
    isApplicationOpen ||
    !isApplicationTime;
  const isCancelDisabled =
    isUserLoading || isDataLoading || isBanned || isActionPending;
  const isActionDisabled = hasApplied ? isCancelDisabled : isApplyDisabled;

  return {
    isApplyDisabled,
    isCancelDisabled,
    isActionDisabled,
    canApply: !isApplyDisabled && !hasApplied,
    canCancel: !isCancelDisabled && hasApplied,
  };
}
