"use client";

import { useQuery } from "@tanstack/react-query";
import { userQueries } from "@/entities/user/api/userQueries";
import { useWakeUpMusicSubscription } from "@/features/wake-up-music/model/useWakeUpMusicSubscription";
import { useStudyAttendanceSubscription } from "@/features/self-study/model/useStudyAttendanceSubscription";

export function RealtimeSubscriptions() {
  const { data: me } = useQuery(userQueries.me());

  useWakeUpMusicSubscription();
  useStudyAttendanceSubscription(me?.role);

  return null;
}
