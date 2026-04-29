"use client";

import { useState } from "react";
import {
  getPeriodNumber,
  getPeriodVariant,
  selectPeriodRange,
} from "@/features/homebase/lib/homebaseReservationPolicy";
import { isPeriodStarted } from "@/features/homebase/lib/isPeriodStarted";
import { PERIODS } from "@/features/homebase/model/constants";

function getInitialPeriod(): string {
  return PERIODS.find((period) => !isPeriodStarted(period)) ?? PERIODS.at(-1)!;
}

export function useHomebasePeriodSelection() {
  const [selectedStartPeriod, setSelectedStartPeriod] =
    useState(getInitialPeriod);
  const [selectedEndPeriod, setSelectedEndPeriod] = useState(getInitialPeriod);

  const selectedStartNum = getPeriodNumber(selectedStartPeriod, PERIODS);
  const selectedEndNum = getPeriodNumber(selectedEndPeriod, PERIODS);

  const handlePeriodSelect = (period: string): boolean => {
    if (isPeriodStarted(period)) return false;

    const nextRange = selectPeriodRange({
      period,
      selectedStartPeriod,
      selectedEndPeriod,
      periods: PERIODS,
    });

    setSelectedStartPeriod(nextRange.startPeriod);
    setSelectedEndPeriod(nextRange.endPeriod);

    return nextRange.shouldResetTable;
  };

  const getPeriodButtonVariant = (period: string) =>
    getPeriodVariant({
      period,
      selectedStartPeriod,
      selectedEndPeriod,
      periods: PERIODS,
      isStarted: isPeriodStarted(period),
    });

  return {
    selectedStartPeriod,
    selectedStartNum,
    selectedEndNum,
    handlePeriodSelect,
    getPeriodButtonVariant,
  };
}
