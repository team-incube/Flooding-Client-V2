"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { dormitoryQueries } from "@/entities/dormitory/api/dormitoryQueries";

function collectCheckedUserIds(value: unknown): number[] {
  if (typeof value === "number") {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectCheckedUserIds);
  }

  if (!value || typeof value !== "object") {
    return [];
  }

  const record = value as Record<string, unknown>;
  const id = record.userId ?? record.id ?? record.studentId;

  if (typeof id === "number") {
    return [id];
  }

  if (record.data !== undefined) {
    return collectCheckedUserIds(record.data);
  }

  if (record.content !== undefined) {
    return collectCheckedUserIds(record.content);
  }

  return [];
}

function parseCheckedUserIds(eventData: string): number[] | null {
  try {
    return collectCheckedUserIds(JSON.parse(eventData));
  } catch {
    const userId = Number(eventData);
    return Number.isFinite(userId) ? [userId] : null;
  }
}

export function useStudyAttendanceSubscription() {
  const queryClient = useQueryClient();
  const [checkedStudentIds, setCheckedStudentIds] = useState<number[]>([]);

  useEffect(() => {
    const accessToken = sessionStorage.getItem("access_token");
    const searchParams = new URLSearchParams();

    if (accessToken) {
      searchParams.set("accessToken", accessToken);
    }

    const eventSource = new EventSource(
      `/api/dormitory/studies/attendance?${searchParams.toString()}`,
    );

    const updateCheckedIds = (event: MessageEvent<string>) => {
      const userIds = parseCheckedUserIds(event.data);

      if (!userIds) {
        queryClient.invalidateQueries({
          queryKey: dormitoryQueries.study().queryKey,
        });
        return;
      }

      setCheckedStudentIds((prev) => [
        ...new Set([...prev, ...userIds]),
      ]);
    };

    eventSource.addEventListener("init", updateCheckedIds);
    eventSource.addEventListener("message", updateCheckedIds);
    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.removeEventListener("init", updateCheckedIds);
      eventSource.removeEventListener("message", updateCheckedIds);
      eventSource.close();
    };
  }, [queryClient]);

  const markChecked = (studentId: number) => {
    setCheckedStudentIds((prev) => [...new Set([...prev, studentId])]);
  };

  return { checkedStudentIds, markChecked };
}
