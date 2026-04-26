"use client";

import { useQuery } from "@tanstack/react-query";
import { homebaseQueries } from "@/entities/homebase/api/homebaseQueries";
import { meQuery } from "@/entities/user/api/getMe";
import {
  getMyHomebaseReservations,
  getReservationItems,
  getReservedTableMembers,
  getSortedReservations,
} from "@/features/homebase/lib/homebaseReservationPolicy";

interface UseHomebaseReservationDataParams {
  selectedFloor: string;
  selectedStartNum: number;
  selectedEndNum: number;
}

export function useHomebaseReservationData({
  selectedFloor,
  selectedStartNum,
  selectedEndNum,
}: UseHomebaseReservationDataParams) {
  const { data: currentUser } = useQuery(meQuery);
  const { data: reservations = [], isLoading } = useQuery(
    homebaseQueries.list(),
  );
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
    reservedTables,
    filteredReservations,
    myReservationItems,
    myReservationIds,
  };
}
