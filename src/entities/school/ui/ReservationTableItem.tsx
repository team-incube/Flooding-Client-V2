"use client";

import { useState } from "react";
import Delete from "@/shared/asset/svg/Delete";
import Edit from "@/shared/asset/svg/Edit";
import MoreVertical from "@/shared/asset/svg/MoreVertical";
import type { Reservation } from "@/entities/school/model/reservation";

interface ReservationTableItemProps {
  reservation: Reservation;
  isOwn?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
}

export function ReservationTableItem({
  reservation,
  isOwn = false,
  onDelete,
  onEdit,
}: ReservationTableItemProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { tableName, floor, members, periods, reason } = reservation;

  return (
    <div className="w-82.5 border border-sub-2 rounded-lg p-4 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-text-3 text-main-text">{tableName}</span>
          <span className="text-caption-1 text-sub-1">{floor}</span>
        </div>
        {isOwn && (
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="cursor-pointer"
          >
            <MoreVertical />
          </button>
        )}
      </div>

      {isOwn && menuOpen ? (
        <div className="flex flex-col">
          <div className="h-px bg-sub-3" />
          <button
            type="button"
            onClick={() => {
              onDelete?.();
              setMenuOpen(false);
            }}
            className="flex items-center justify-center gap-2 py-3 cursor-pointer"
          >
            <span className="text-text-3 text-negative">삭제하기</span>
            <div className="text-negative">
              <Delete />
            </div>
          </button>
          <div className="h-px bg-sub-3" />
          <button
            type="button"
            onClick={() => {
              onEdit?.();
              setMenuOpen(false);
            }}
            className="flex items-center justify-center gap-2 py-3 cursor-pointer"
          >
            <span className="text-text-3 text-main-text">수정하기</span>
            <Edit />
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {[members.slice(0, 3), members.slice(3, 6)]
            .filter((row) => row.length > 0)
            .map((row, index) => (
              <p key={index} className="text-text-4 text-sub-1">
                {row.join(", ")}
              </p>
            ))}
          <p className="text-text-4 text-sub-2">교시: {periods.join(", ")}</p>
          {reason && <p className="text-text-4 text-sub-2">사유: {reason}</p>}
        </div>
      )}
    </div>
  );
}
