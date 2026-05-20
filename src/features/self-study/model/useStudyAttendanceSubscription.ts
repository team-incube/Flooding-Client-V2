"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { dormitoryQueries } from "@/entities/dormitory/api/dormitoryQueries";
import { createStudyPermission } from "@/entities/dormitory/lib/studyPermission";
import type {
  StudyApplicant,
  StudyApplicants,
} from "@/entities/dormitory/model/dormitory";
import type { UserRole } from "@/entities/user/model/user";

function resolveUserIds(
  eventData: string,
  applicants: StudyApplicant[],
): number[] | null {
  let parsed: unknown;

  try {
    parsed = JSON.parse(eventData);
  } catch {
    const num = Number(eventData);
    return Number.isFinite(num) ? [num] : null;
  }

  const items = Array.isArray(parsed) ? parsed : [parsed];
  const userIds: number[] = [];

  for (const item of items) {
    if (!item || typeof item !== "object") continue;

    const record = item as Record<string, unknown>;

    if (typeof record.userId === "number") {
      userIds.push(record.userId);
    } else if (typeof record.studentNumber === "number") {
      const matched = applicants.find(
        (a) => a.studentNumber === record.studentNumber,
      );
      if (matched) userIds.push(matched.userId);
    }
  }

  return userIds.length > 0 ? userIds : null;
}

export function useStudyAttendanceSubscription(role?: UserRole) {
  const queryClient = useQueryClient();
  const [checkedStudentIds, setCheckedStudentIds] = useState<number[]>([]);
  const [uncheckedStudentIds, setUncheckedStudentIds] = useState<number[]>([]);

  useEffect(() => {
    const studyPermission = createStudyPermission({ role });

    if (!studyPermission.canCheckAttendance) {
      return;
    }

    const accessToken = sessionStorage.getItem("access_token");
    const searchParams = new URLSearchParams();

    if (accessToken) {
      searchParams.set("accessToken", accessToken);
    }

    const eventSource = new EventSource(
      `/api/dormitory/studies/attendance?${searchParams.toString()}`,
    );

    const getApplicants = () =>
      queryClient.getQueryData<StudyApplicants>(
        dormitoryQueries.study().queryKey,
      )?.applicants ?? [];

    const fallbackInvalidate = () =>
      queryClient.invalidateQueries({
        queryKey: dormitoryQueries.study().queryKey,
      });

    const handleInitEvent = (event: MessageEvent<string>) => {
      const userIds = resolveUserIds(event.data, getApplicants());

      if (!userIds) {
        fallbackInvalidate();
        return;
      }

      setCheckedStudentIds(userIds);
      setUncheckedStudentIds([]);
    };

    const handleAttendanceEvent = (event: MessageEvent<string>) => {
      console.log("attendance", event);

      const userIds = resolveUserIds(event.data, getApplicants());

      if (!userIds) {
        fallbackInvalidate();
        return;
      }

      setCheckedStudentIds((prev) => [...new Set([...prev, ...userIds])]);
      setUncheckedStudentIds((prev) =>
        prev.filter((id) => !userIds.includes(id)),
      );
    };

    const handleCancelAttendanceEvent = (event: MessageEvent<string>) => {
      console.log("cancel-attendance", event);

      const userIds = resolveUserIds(event.data, getApplicants());

      if (!userIds) {
        fallbackInvalidate();
        return;
      }

      setCheckedStudentIds((prev) =>
        prev.filter((id) => !userIds.includes(id)),
      );
      setUncheckedStudentIds((prev) => [...new Set([...prev, ...userIds])]);
    };

    eventSource.addEventListener("init", handleInitEvent);
    eventSource.addEventListener("attendance", handleAttendanceEvent);
    eventSource.addEventListener(
      "cancel-attendance",
      handleCancelAttendanceEvent,
    );

    return () => {
      eventSource.removeEventListener("init", handleInitEvent);
      eventSource.removeEventListener("attendance", handleAttendanceEvent);
      eventSource.removeEventListener(
        "cancel-attendance",
        handleCancelAttendanceEvent,
      );
      eventSource.close();
    };
  }, [queryClient, role]);

  const markChecked = (studentId: number) => {
    setCheckedStudentIds((prev) => [...new Set([...prev, studentId])]);
    setUncheckedStudentIds((prev) => prev.filter((id) => id !== studentId));
  };

  const markUnchecked = (studentId: number) => {
    setCheckedStudentIds((prev) => prev.filter((id) => id !== studentId));
    setUncheckedStudentIds((prev) => [...new Set([...prev, studentId])]);
  };

  return { checkedStudentIds, uncheckedStudentIds, markChecked, markUnchecked };
}
