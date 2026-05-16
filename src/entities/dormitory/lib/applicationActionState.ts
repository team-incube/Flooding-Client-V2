interface CreateApplicationActionStateParams {
  hasApplied: boolean;
  isUserLoading: boolean;
  isDataLoading: boolean;
  isActionPending: boolean;
  isApplicationOpen: boolean;
  isBanned?: boolean;
}

export function createApplicationActionState({
  hasApplied,
  isUserLoading,
  isDataLoading,
  isActionPending,
  isApplicationOpen,
  isBanned = false,
}: CreateApplicationActionStateParams) {
  const isApplyDisabled =
    isUserLoading ||
    isDataLoading ||
    isBanned ||
    isActionPending ||
    !isApplicationOpen;
  const isCancelDisabled =
    isUserLoading ||
    isDataLoading ||
    isBanned ||
    isActionPending ||
    !isApplicationOpen;
  const isActionDisabled = hasApplied ? isCancelDisabled : isApplyDisabled;

  return {
    isApplyDisabled,
    isCancelDisabled,
    isActionDisabled,
    canApply: !isApplyDisabled && !hasApplied,
    canCancel: !isCancelDisabled && hasApplied,
  };
}
