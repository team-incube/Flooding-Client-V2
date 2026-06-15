"use client";

import { useQuery } from "@tanstack/react-query";
import { homebaseQueries } from "@/entities/homebase/api/homebaseQueries";
import { userQueries } from "@/entities/user/api/userQueries";
import {
  getMyHomebaseReservations,
  getReservationItems,
  getReservedTableMembers,
  getSortedReservations,
} from "@/features/homebase/lib/homebaseReservationPolicy";

interface UseHomebaseReservationDataParams {
  reservationDate: string;
  selectedFloor: string;
  selectedStartNum: number;
  selectedEndNum: number;
}

export function useHomebaseReservationData({
  reservationDate,
  selectedFloor,
  selectedStartNum,
  selectedEndNum,
}: UseHomebaseReservationDataParams) {
  const { data: currentUser } = useQuery(userQueries.me());
  const {
    data: reservations = [],
    isLoading,
    isError,
  } = useQuery(homebaseQueries.list(reservationDate));
  const reservedTables = getReservedTableMembers({
    reservations,
    selectedFloor,
    startPeriod: selectedStartNum,
    endPeriod: selectedEndNum,
  });
  const filteredReservations = getSortedReservations(reservations);
  const myReservationSources = getMyHomebaseReservations(
    reservations,
    currentUser?.studentNumber,
  );
  const myReservationItems = getReservationItems(myReservationSources);
  const myReservationIds = new Set(
    myReservationSources.map((reservation) => reservation.id),
  );

  return {
    currentUser,
    reservations,
    isLoading,
    isError,
    reservedTables,
    filteredReservations,
    myReservationItems,
    myReservationIds,
  };
}
