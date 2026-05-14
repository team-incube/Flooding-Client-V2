"use client";

import { useState } from "react";
import { toast } from "sonner";
import { getMaxPersonnel } from "@/features/homebase/lib/getMaxPersonnel";
import { useHomebasePeriodSelection } from "@/features/homebase/model/useHomebasePeriodSelection";
import { useHomebaseReservationActions } from "@/features/homebase/model/useHomebaseReservationActions";
import { useHomebaseReservationData } from "@/features/homebase/model/useHomebaseReservationData";
import { useHomebaseStudentSelection } from "@/features/homebase/model/useHomebaseStudentSelection";
import { formatDateParam } from "@/shared/lib/date";

export function useHomebaseReservation() {
  const [selectedFloor, setSelectedFloor] = useState("2F");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [reservationDate] = useState(() => formatDateParam(new Date()));
  const {
    selectedStartPeriod,
    selectedStartNum,
    selectedEndNum,
    handlePeriodSelect: selectPeriod,
    getPeriodButtonVariant,
  } = useHomebasePeriodSelection({
    canSelectMultiplePeriods: selectedTable !== null,
  });
  const {
    currentUser,
    reservations,
    isLoading,
    reservedTables,
    filteredReservations,
    myReservationItems,
    myReservationIds,
    isError,
  } = useHomebaseReservationData({
    selectedFloor,
    selectedStartNum,
    selectedEndNum,
  });
  const {
    name,
    triedToOverfill,
    maxPersonnel,
    isFull,
    isStudentFull,
    filteredStudents,
    selectedStudents,
    handleNameChange,
    handleStudentAdd,
    handleNameKeyDown,
    handleRemoveStudent,
    resetStudentSelection,
    resetOverfill,
  } = useHomebaseStudentSelection({
    selectedFloor,
    selectedTable,
    currentStudentNumber: currentUser?.studentNumber,
  });

  const handleFloorChange = (floor: string) => {
    setSelectedFloor(floor);
    setSelectedTable(null);
    resetOverfill();
  };

  const handleTableSelect = (table: string) => {
    if (reservedTables[table]) {
      toast.warning("이미 예약된 테이블입니다");
      return;
    }

    const nextTable = selectedTable === table ? null : table;

    if (nextTable === null) {
      setSelectedTable(null);
      resetOverfill();
      return;
    }

    const max = getMaxPersonnel(selectedFloor, nextTable);
    if (max > 0 && selectedStudents.length + 1 > max) {
      toast.warning(`선택한 테이블의 최대 인원은 ${max}명입니다`);
      return;
    }

    setSelectedTable(nextTable);
    resetOverfill();
  };

  const handlePeriodSelect = (period: string) => {
    const shouldResetTable = selectPeriod(period);

    if (shouldResetTable) {
      setSelectedTable(null);
      resetOverfill();
    }
  };

  const handleReasonChange = (value: string) => {
    setReason(value);
  };

  const handleApplySuccess = () => {
    resetStudentSelection();
    setReason("");
    setSelectedTable(null);
  };

  const { canSubmit, handleSubmit, handleDeleteReservation } =
    useHomebaseReservationActions({
      selectedFloor,
      selectedTable,
      selectedStartPeriod,
      selectedStartNum,
      selectedEndNum,
      reservationDate,
      reason,
      reservations,
      currentUser,
      selectedStudents,
      onApplySuccess: handleApplySuccess,
    });

  return {
    selectedFloor,
    selectedTable,
    name,
    reason,
    triedToOverfill,
    maxPersonnel,
    isFull,
    isStudentFull,
    filteredStudents,
    reservedTables,
    filteredReservations,
    myReservationItems,
    myReservationIds,
    isLoading,
    isError,
    canSubmit,
    selectedStudents,
    handleFloorChange,
    handleTableSelect,
    handleNameChange,
    handleStudentAdd,
    handleNameKeyDown,
    handleRemoveStudent,
    handleReasonChange,
    handlePeriodSelect,
    getPeriodButtonVariant,
    handleSubmit,
    handleDeleteReservation,
  };
}
