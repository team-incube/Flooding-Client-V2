"use client";

import type { KeyboardEvent } from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { userQueries } from "@/entities/user/api/userQueries";
import type { SearchUsersParams } from "@/entities/user/model/user";
import { getMaxPersonnel } from "@/features/homebase/lib/getMaxPersonnel";
import {
  filterAvailableStudents,
  type HomebaseSelectableStudent,
  removeSelectedStudent,
} from "@/features/homebase/lib/studentSelection";
import { useDebouncedValue } from "@/shared/lib/useDebouncedValue";

interface UseHomebaseStudentSelectionParams {
  selectedFloor: string;
  selectedTable: string | null;
  currentStudentNumber?: number;
}

const STUDENT_SEARCH_RESULT_LIMIT = 5;

export function useHomebaseStudentSelection({
  selectedFloor,
  selectedTable,
  currentStudentNumber,
}: UseHomebaseStudentSelectionParams) {
  const [name, setName] = useState("");
  const [triedToOverfill, setTriedToOverfill] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<
    HomebaseSelectableStudent[]
  >([]);
  const debouncedName = useDebouncedValue(name.trim(), 300);
  const searchParams: SearchUsersParams = /^\d+$/.test(debouncedName)
    ? { studentNumber: debouncedName, size: STUDENT_SEARCH_RESULT_LIMIT }
    : { name: debouncedName, size: STUDENT_SEARCH_RESULT_LIMIT };
  const { data: studentSearchPage } = useQuery({
    ...userQueries.list(searchParams),
    enabled: debouncedName.length > 0,
  });

  const maxPersonnel = getMaxPersonnel(selectedFloor, selectedTable);
  const isFull =
    maxPersonnel > 0 && selectedStudents.length >= maxPersonnel - 1;
  const isStudentFull = selectedTable ? isFull : selectedStudents.length >= 5;
  const filteredStudents = filterAvailableStudents({
    searchKeyword: debouncedName,
    selectedStudents,
    students: studentSearchPage?.content ?? [],
  })
    .filter((student) => student.studentNumber !== currentStudentNumber)
    .slice(0, STUDENT_SEARCH_RESULT_LIMIT);

  const handleNameChange = (value: string) => {
    setName(value);
  };

  const handleStudentAdd = (student: HomebaseSelectableStudent) => {
    if (!selectedTable && selectedStudents.length >= 5) {
      toast.warning("테이블을 선택해주세요");
      return;
    }

    if (selectedTable && isFull) {
      setTriedToOverfill(true);
      return;
    }

    setTriedToOverfill(false);
    setSelectedStudents((prev) => [...prev, student]);
    setName("");
  };

  const handleNameKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && filteredStudents.length > 0) {
      handleStudentAdd(filteredStudents[0]);
    }
  };

  const handleRemoveStudent = (studentNumber: number) => {
    setSelectedStudents((prev) => removeSelectedStudent(prev, studentNumber));
    setTriedToOverfill(false);
  };

  const resetStudentSelection = () => {
    setSelectedStudents([]);
    setTriedToOverfill(false);
  };

  const resetOverfill = () => {
    setTriedToOverfill(false);
  };

  return {
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
  };
}
