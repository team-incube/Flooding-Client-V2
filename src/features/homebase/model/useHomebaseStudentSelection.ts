"use client";

import type { KeyboardEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { MOCK_STUDENTS } from "@/entities/user/model/mock";
import type { User } from "@/entities/user/model/user";
import { getMaxPersonnel } from "@/features/homebase/lib/getMaxPersonnel";
import {
  filterAvailableStudents,
  removeSelectedStudent,
} from "@/features/homebase/lib/studentSelection";

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
  const [selectedStudents, setSelectedStudents] = useState<User[]>([]);

  const maxPersonnel = getMaxPersonnel(selectedFloor, selectedTable);
  const isFull =
    maxPersonnel > 0 && selectedStudents.length >= maxPersonnel - 1;
  const isStudentFull = selectedTable ? isFull : selectedStudents.length >= 5;
  // TODO: Replace MOCK_STUDENTS with the student search API when it is available.
  const filteredStudents = filterAvailableStudents({
    searchKeyword: name,
    selectedStudents,
    students: MOCK_STUDENTS,
  })
    .filter((student) => student.studentNumber !== currentStudentNumber)
    .slice(0, STUDENT_SEARCH_RESULT_LIMIT);

  const handleNameChange = (value: string) => {
    setName(value);
  };

  const handleStudentAdd = (student: User) => {
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
