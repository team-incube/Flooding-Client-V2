"use client";

import { useSyncExternalStore } from "react";

const STUDY_BAN_STORAGE_KEY = "flooding:mock-study-ban-user-ids";
const STUDY_BAN_STORAGE_EVENT = "flooding:mock-study-ban-change";

function parseStoredIds(value: string | null): number[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((id): id is number => typeof id === "number");
  } catch {
    return [];
  }
}

function getStoredSnapshot(): string {
  if (typeof window === "undefined") {
    return "[]";
  }

  return localStorage.getItem(STUDY_BAN_STORAGE_KEY) ?? "[]";
}

function subscribeStudyBanStore(onStoreChange: () => void) {
  window.addEventListener(STUDY_BAN_STORAGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(STUDY_BAN_STORAGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function setStoredBannedStudentIds(studentIds: number[]) {
  localStorage.setItem(STUDY_BAN_STORAGE_KEY, JSON.stringify(studentIds));
  window.dispatchEvent(new Event(STUDY_BAN_STORAGE_EVENT));
}

export function useStudyBanMockState() {
  const bannedStudentIds = parseStoredIds(
    useSyncExternalStore(
      subscribeStudyBanStore,
      getStoredSnapshot,
      () => "[]",
    ),
  );

  const banStudent = (studentId: number) => {
    if (bannedStudentIds.includes(studentId)) {
      return;
    }

    setStoredBannedStudentIds([...bannedStudentIds, studentId]);
  };

  const banStudents = (studentIds: number[]) => {
    const nextBannedStudentIds = Array.from(
      new Set([...bannedStudentIds, ...studentIds]),
    );

    setStoredBannedStudentIds(nextBannedStudentIds);
  };

  const resetBannedStudents = () => setStoredBannedStudentIds([]);

  const isStudyBanned = (studentId?: number) =>
    typeof studentId === "number" && bannedStudentIds.includes(studentId);

  return {
    bannedStudentIds,
    banStudent,
    banStudents,
    resetBannedStudents,
    isStudyBanned,
  };
}
