"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import HomeBase from "@/shared/asset/svg/HomeBase";
import Search from "@/shared/asset/svg/Search";
import TextField from "@/shared/ui/textField";
import { TextButton } from "@/shared/ui/Button/TextButton";
import { SecondFloor } from "@/shared/ui/homebase/SecondFloor";
import { ThirdFloor } from "@/shared/ui/homebase/ThirdFloor";
import { FourthFloor } from "@/shared/ui/homebase/FourthFloor";
import StudentSearch from "@/features/homebase/ui/StudentSearch";
import SelectedStudent from "@/features/homebase/ui/SelectedStudent";
import { User } from "@/entities/user/model/user";
import { ReservationTableItem } from "@/entities/school/ui/ReservationTableItem";
import { homebaseQueries, homebaseMutations } from "@/features/homebase/api/homebase.queries";
import type { HomebaseReservation, HomebaseApplyRequest } from "@/features/homebase/model/types";
import type { Reservation } from "@/entities/school/model/reservation";

const FLOORS = [
  { value: "2F", label: "2층" },
  { value: "3F", label: "3층" },
  { value: "4F", label: "4층" },
];

const PERIODS = ["8교시", "9교시", "10교시", "11교시"];

const PERIODS_TIME: Record<string, string> = {
  "8교시": "16:40",
  "9교시": "17:40",
  "10교시": "19:30",
  "11교시": "20:30",
};

export const TABLE_MAX_PERSONNEL = {
  "2F": { "1": 6, "2": 4, "3": 4 },
  "3F": { "1": 6, "2": 6, "3": 4, "5": 4, "6": 4 },
  "4F": { "1": 6, "2": 6, "3": 4, "4": 4 },
} as const;

// homebaseId ↔ { floor, tableName } 매핑
// 실제 백엔드 homebaseId 값에 맞게 수정 필요
const HOMEBASE_ID_MAP: Record<number, { floor: string; tableName: string }> = {
  1: { floor: "2F", tableName: "테이블 1" },
  2: { floor: "2F", tableName: "테이블 2" },
  3: { floor: "2F", tableName: "테이블 3" },
  4: { floor: "3F", tableName: "테이블 1" },
  5: { floor: "3F", tableName: "테이블 2" },
  6: { floor: "3F", tableName: "테이블 3" },
  7: { floor: "3F", tableName: "테이블 5" },
  8: { floor: "3F", tableName: "테이블 6" },
  9: { floor: "4F", tableName: "테이블 1" },
  10: { floor: "4F", tableName: "테이블 2" },
  11: { floor: "4F", tableName: "테이블 3" },
  12: { floor: "4F", tableName: "테이블 4" },
};

const FLOOR_TABLE_TO_ID: Record<string, number> = Object.fromEntries(
  Object.entries(HOMEBASE_ID_MAP).map(([id, { floor, tableName }]) => [
    `${floor}-${tableName.replace("테이블 ", "")}`,
    Number(id),
  ])
);

function toReservation(r: HomebaseReservation): Reservation {
  const { floor, tableName } = HOMEBASE_ID_MAP[r.homebaseId] ?? {
    floor: "?F",
    tableName: `테이블 ${r.homebaseId}`,
  };

  const periods: string[] = [];
  for (let p = r.startPeriod; p <= r.endPeriod; p++) {
    periods.push(`${p}교시`);
  }

  return {
    id: r.id,
    tableName,
    floor,
    members: r.members.map((m) => `${m.studentNumber} ${m.name}`),
    periods,
    reason: "",
  };
}

export default function HomebaseCard({
  showReservations = false,
}: {
  showReservations?: boolean;
}) {
  const [selectedFloor, setSelectedFloor] = useState("2F");
  const [selectedPeriod, setSelectedPeriod] = useState("8교시");
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<User[]>([]);

  const queryClient = useQueryClient();
  const { data: reservations = [] } = useQuery(homebaseQueries.list());

  const applyMutation = useMutation({
    mutationFn: ({ homebaseId, body }: { homebaseId: number; body: HomebaseApplyRequest }) =>
      homebaseMutations.apply(homebaseId, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["homebase"] }),
  });

  const cancelMutation = useMutation({
    mutationFn: (homebaseId: number) => homebaseMutations.cancel(homebaseId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["homebase"] }),
  });

  const isPeriodStarted = (period: string) => {
    const now = new Date();
    const [hour, minute] = PERIODS_TIME[period].split(":").map(Number);
    const periodTime = new Date();
    periodTime.setHours(hour, minute, 0, 0);
    return now >= periodTime;
  };

  const handleFloorChange = (floor: string) => {
    setSelectedFloor(floor);
    setSelectedTable(null);
  };

  const renderFloor = () => {
    switch (selectedFloor) {
      case "2F":
        return (
          <SecondFloor
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
          />
        );
      case "3F":
        return (
          <ThirdFloor
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
          />
        );
      case "4F":
        return (
          <FourthFloor
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
          />
        );
    }
  };

  const getMaxPersonnel = (floor: string, table: string | null): number => {
    if (!table) return 0;
    const floorKey = floor as keyof typeof TABLE_MAX_PERSONNEL;
    if (!TABLE_MAX_PERSONNEL[floorKey]) return 0;
    const floorTables = TABLE_MAX_PERSONNEL[floorKey];
    const tableKey = table as keyof typeof floorTables;
    return floorTables[tableKey] ?? 0;
  };

  const maxPersonnel = getMaxPersonnel(selectedFloor, selectedTable);
  const isFull = maxPersonnel > 0 && selectedStudents.length >= maxPersonnel;
  const canSubmit = selectedTable && isFull && reason.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit || !selectedTable) return;

    const periodIndex = PERIODS.indexOf(selectedPeriod);
    const startPeriod = 8 + periodIndex;
    const homebaseId = FLOOR_TABLE_TO_ID[`${selectedFloor}-${selectedTable}`];

    applyMutation.mutate({
      homebaseId,
      body: {
        homebaseId,
        startPeriod,
        endPeriod: startPeriod,
        members: selectedStudents.map((s) => ({
          studentNumber: String(s.studentNumber),
          name: s.name,
        })),
      },
    });
  };

  const filteredReservations = reservations
    .filter((r) => (HOMEBASE_ID_MAP[r.homebaseId]?.floor ?? "") === selectedFloor)
    .map(toReservation);

  // 내 예약: 로그인 유저 기준으로 필터링 필요 — 임시로 첫 번째 항목
  const myReservation = reservations.length > 0 ? toReservation(reservations[0]) : null;

  return (
    <div className="w-full bg-background-surface rounded-2xl p-6 flex flex-col">
      <div className="flex items-center gap-1">
        <HomeBase />
        <span className="text-text-1 font-semibold text-main-text">
          홈베이스
        </span>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <span className="text-text-3 font-medium text-sub-1">층</span>
        {FLOORS.map(({ value, label }) => (
          <TextButton
            key={value}
            variant={selectedFloor === value ? "filled" : "outlined"}
            onClick={() => handleFloorChange(value)}
          >
            {label}
          </TextButton>
        ))}

        <span className="text-text-3 font-medium text-sub-1">교시</span>
        {PERIODS.map((period) => (
          <TextButton
            key={period}
            variant={
              isPeriodStarted(period)
                ? "disabled"
                : selectedPeriod === period
                  ? "filled"
                  : "outlined"
            }
            onClick={() => {
              if (!isPeriodStarted(period)) setSelectedPeriod(period);
            }}
          >
            {period}
          </TextButton>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-6 2xl:justify-between mt-3">
        <div className="w-full lg:flex-1 min-w-0">{renderFloor()}</div>

        <div className="w-full lg:shrink-0 flex flex-col sm:flex-row gap-6 lg:w-82.5 lg:flex-col lg:gap-4">
          <div className="w-full sm:w-75 lg:w-full shrink-0 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <TextField
                placeholder="이름, 학번등을 입력해주세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
                rightIcon={<Search />}
              />
              <StudentSearch
                search={name}
                selectedStudents={selectedStudents}
                setSelectedStudents={setSelectedStudents}
                isFull={isFull}
              />
            </div>

            <div className="flex flex-col gap-1">
              <textarea
                placeholder="이용 사유를 적어주세요"
                value={reason}
                maxLength={20}
                onChange={(e) => setReason(e.target.value)}
                className="w-full h-30 rounded-lg border border-sub-2 bg-background-surface text-main-text placeholder:text-sub-2 focus:border-sub-1 outline-none p-4 resize-none caret-p-1 transition-all"
              />
              <span className="text-right text-sub-2 text-size-caption-1">
                {reason.length}/20
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <TextButton
                variant={canSubmit ? "filled" : "disabled"}
                size="wide"
                onClick={handleSubmit}
              >
                신청하기
              </TextButton>
              <span
                className={
                  selectedTable && isFull ? "text-negative" : "text-sub-2"
                }
              >
                {selectedTable && isFull
                  ? `※ 테이블 ${selectedTable}번의 최대인원은 ${maxPersonnel}명입니다`
                  : "※ 홈베이스 신청시 연속 신청이 가능해요"}
              </span>
            </div>
          </div>

          <SelectedStudent
            selectedStudents={selectedStudents}
            setSelectedStudents={setSelectedStudents}
          />

          {showReservations && (
            <div className="flex-1 flex flex-col gap-3">
              <span className="font-semibold text-sub-1 text-text-2 text-center">
                내 예약현황
              </span>
              {myReservation ? (
                <ReservationTableItem
                  reservation={myReservation}
                  isOwn
                  onDelete={() => cancelMutation.mutate(reservations[0].homebaseId)}
                  onEdit={() => {}}
                />
              ) : (
                <div className="flex flex-1 items-center justify-center">
                  <span className="text-sub-2 text-text-4">
                    아직 예약을 안하셨어요!
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showReservations && (
        <div className="flex flex-col gap-4 mt-4">
          <span className="text-text-2 font-semibold text-main-text">
            예약현황
          </span>
          <div className="flex flex-wrap gap-3 items-start">
            {filteredReservations.length === 0 ? (
              <span className="text-text-3 text-sub-2">
                현재 모든 테이블 예약이 가능합니다
              </span>
            ) : (
              filteredReservations.map((item) => (
                <ReservationTableItem
                  key={item.id}
                  reservation={item}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
