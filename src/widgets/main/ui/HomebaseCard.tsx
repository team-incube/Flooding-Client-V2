"use client";

import { useState } from "react";
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
import {
  MOCK_RESERVATIONS,
  MOCK_MY_RESERVATION,
} from "@/entities/school/model/mock";

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

  const filteredReservations = MOCK_RESERVATIONS.filter(
    (r) => r.floor === selectedFloor,
  );

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

        <div className="w-full lg:shrink-0 flex flex-col sm:flex-row gap-6 lg:w-[330px] lg:flex-col lg:gap-4">
          <div className="w-full sm:w-[300px] lg:w-full shrink-0 flex flex-col gap-4">
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
                className="w-full h-[120px] rounded-lg border border-sub-2 bg-background-surface text-main-text placeholder:text-sub-2 focus:border-sub-1 outline-none p-4 resize-none caret-p-1 transition-all"
              />
              <span className="text-right text-sub-2 text-size-caption-1">
                {reason.length}/20
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <TextButton
                variant={canSubmit ? "filled" : "disabled"}
                size="wide"
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
              {MOCK_MY_RESERVATION ? (
                <ReservationTableItem reservation={MOCK_MY_RESERVATION} isOwn />
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
