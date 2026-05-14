"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  homebaseMutations,
  homebaseQueries,
} from "@/entities/homebase/api/homebaseQueries";
import { getHomebaseId } from "@/entities/homebase/lib/homebaseReservation";
import type {
  HomebaseApplyRequest,
  HomebaseReservation,
} from "@/entities/homebase/model/homebase";
import { createHomebasePermission } from "@/entities/user/lib/permission";
import type { User } from "@/entities/user/model/user";
import {
  createHomebaseApplyRequest,
  hasHomebaseReservationConflict,
} from "@/features/homebase/lib/homebaseReservationPolicy";
import { homebaseReservationDraftSchema } from "@/features/homebase/lib/homebaseReservationSchema";
import type { HomebaseSelectableStudent } from "@/features/homebase/lib/studentSelection";
import { isPeriodStarted } from "@/features/homebase/lib/isPeriodStarted";

interface UseHomebaseReservationActionsParams {
  selectedFloor: string;
  selectedTable: string | null;
  selectedStartPeriod: string;
  selectedStartNum: number;
  selectedEndNum: number;
  reservationDate: string;
  reason: string;
  reservations: HomebaseReservation[];
  currentUser?: User | null;
  selectedStudents: HomebaseSelectableStudent[];
  onApplySuccess: () => void;
}

export function useHomebaseReservationActions({
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
  onApplySuccess,
}: UseHomebaseReservationActionsParams) {
  const queryClient = useQueryClient();
  const homebasePermission = createHomebasePermission({
    role: currentUser?.role,
  });
  const reservationDraft = {
    reservationDate,
    startPeriod: selectedStartNum,
    endPeriod: selectedEndNum,
    reason,
    selectedTable: selectedTable ?? "",
  };
  const reservationValidation =
    homebaseReservationDraftSchema.safeParse(reservationDraft);
  const targetHomebaseId = selectedTable
    ? getHomebaseId(selectedFloor, selectedTable)
    : null;
  const hasConflict = hasHomebaseReservationConflict({
    reservations,
    homebaseId: targetHomebaseId,
    startPeriod: selectedStartNum,
    endPeriod: selectedEndNum,
    currentStudentNumber: currentUser?.studentNumber,
  });

  const applyMutation = useMutation({
    mutationFn: ({
      homebaseId,
      body,
    }: {
      homebaseId: number;
      body: HomebaseApplyRequest;
    }) => homebaseMutations.apply(homebaseId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: homebaseQueries.list().queryKey,
      });
      onApplySuccess();
      toast.success("홈베이스 신청이 완료되었습니다");
    },
    onError: () => toast.error("신청에 실패했습니다. 다시 시도해주세요"),
  });

  const cancelMutation = useMutation({
    mutationFn: (reservationId: number) =>
      homebaseMutations.cancel(reservationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: homebaseQueries.list().queryKey,
      });
      toast.success("예약이 취소되었습니다");
    },
    onError: () => toast.error("취소에 실패했습니다. 다시 시도해주세요"),
  });
  const canSubmit =
    homebasePermission.canReserve &&
    reservationValidation.success &&
    !applyMutation.isPending;

  const handleSubmit = () => {
    if (!homebasePermission.canReserve || applyMutation.isPending) return;

    const parsed = homebaseReservationDraftSchema.safeParse(reservationDraft);

    if (!parsed.success) {
      if (!selectedTable) {
        toast.warning("테이블을 선택해주세요");
        return;
      }

      if (!reason.trim()) {
        toast.warning("신청사유를 입력해주세요");
        return;
      }

      return;
    }

    if (isPeriodStarted(selectedStartPeriod)) {
      toast.warning("이미 지난 교시는 신청할 수 없습니다");
      return;
    }

    if (hasConflict) {
      toast.warning("해당 시간대에 이미 예약이 존재합니다");
      return;
    }

    const homebaseId = getHomebaseId(selectedFloor, parsed.data.selectedTable);

    if (!homebaseId) return;

    applyMutation.mutate({
      homebaseId,
      body: createHomebaseApplyRequest({
        reservationDate: parsed.data.reservationDate,
        startPeriod: parsed.data.startPeriod,
        endPeriod: parsed.data.endPeriod,
        reason: parsed.data.reason,
        currentUser,
        selectedStudents,
      }),
    });
  };

  const handleDeleteReservation = (reservationId: number) => {
    cancelMutation.mutate(reservationId);
  };

  return {
    canSubmit,
    handleSubmit,
    handleDeleteReservation,
  };
}
