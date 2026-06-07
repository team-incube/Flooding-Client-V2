interface CreateApplicationActionStateParams {
  hasApplied: boolean;
  isUserLoading: boolean;
  isDataLoading: boolean;
  isActionPending: boolean;
  isApplicationOpen: boolean;
  isBanned?: boolean;
  isCancelled?: boolean;
  isFull?: boolean;
}

export function createApplicationActionState({
  hasApplied,
  isUserLoading,
  isDataLoading,
  isActionPending,
  isApplicationOpen,
  isBanned = false,
  isCancelled = false,
  isFull = false,
}: CreateApplicationActionStateParams) {
  const isApplyDisabled =
    isUserLoading ||
    isDataLoading ||
    isBanned ||
    isCancelled ||
    isActionPending ||
    isFull ||
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
