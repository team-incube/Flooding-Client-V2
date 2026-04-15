"use client";

import { useState } from "react";
import type { User } from "@/entities/user/model/user";
import { MOCK_RESERVATIONS } from "@/entities/school/model/mock";
import { getMaxPersonnel } from "../lib/getMaxPersonnel";

export function useHomebaseForm() {
  const [selectedFloor, setSelectedFloor] = useState("2F");
  const [selectedPeriod, setSelectedPeriod] = useState("8교시");
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<User[]>([]);

  const handleFloorChange = (floor: string) => {
    setSelectedFloor(floor);
    setSelectedTable(null);
  };

  const maxPersonnel = getMaxPersonnel(selectedFloor, selectedTable);
  const isFull = maxPersonnel > 0 && selectedStudents.length >= maxPersonnel;
  const canSubmit = selectedTable !== null && isFull && reason.trim().length > 0;

  const filteredReservations = MOCK_RESERVATIONS.filter(
    (r) => r.floor === selectedFloor,
  );

  return {
    selectedFloor,
    setSelectedFloor,
    selectedPeriod,
    setSelectedPeriod,
    name,
    setName,
    reason,
    setReason,
    selectedTable,
    setSelectedTable,
    selectedStudents,
    setSelectedStudents,
    handleFloorChange,
    maxPersonnel,
    isFull,
    canSubmit,
    filteredReservations,
  };
}
