"use client";

import { useState } from "react";
import HomeBase from "@/shared/asset/svg/HomeBase";
import Search from "@/shared/asset/svg/Search";
import TextField from "@/shared/ui/textField";
import { TextButton } from "@/shared/ui/Button/TextButton";
import { SecondFloor } from "@/shared/ui/homebase/SecondFloor";
import { ThirdFloor } from "@/shared/ui/homebase/ThirdFloor";
import { FourthFloor } from "@/shared/ui/homebase/FourthFloor";
import { ReservationTableItem } from "@/entities/school/ui/ReservationTableItem";
import type { Reservation } from "@/entities/school/model/reservation";

const FLOORS = [
  { value: "2F", label: "2층" },
  { value: "3F", label: "3층" },
  { value: "4F", label: "4층" },
];
const PERIODS = ["8교시", "9교시", "10교시", "11교시"];

export default function HomebaseCard({
  children,
  selectedFloor: selectedFloorProp,
  onFloorChange,
  myReservation,
  reservations = [],
}: {
  children?: React.ReactNode;
  selectedFloor?: string;
  onFloorChange?: (floor: string) => void;
  myReservation?: Reservation;
  reservations?: Reservation[];
}) {
  const [internalFloor, setInternalFloor] = useState("2F");
  const selectedFloor = selectedFloorProp ?? internalFloor;

  const handleFloorChange = (floor: string) => {
    setInternalFloor(floor);
    setSelectedTable(null);
    onFloorChange?.(floor);
  };

  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("8교시");
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");

  const renderFloor = () => {
    switch (selectedFloor) {
      case "2F":
        return <SecondFloor reservations={reservations} selectedTable={selectedTable ?? undefined} onTableSelect={setSelectedTable} />;
      case "3F":
        return <ThirdFloor reservations={reservations} selectedTable={selectedTable ?? undefined} onTableSelect={setSelectedTable} />;
      case "4F":
        return <FourthFloor reservations={reservations} selectedTable={selectedTable ?? undefined} onTableSelect={setSelectedTable} />;
    }
  };

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
            variant={selectedPeriod === period ? "filled" : "outlined"}
            onClick={() => setSelectedPeriod(period)}
          >
            {period}
          </TextButton>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-6 2xl:justify-between mt-3">
        <div className="w-full lg:flex-1 min-w-0">{renderFloor()}</div>

        <div className="w-full lg:shrink-0 flex flex-col sm:flex-row gap-6 lg:w-[330px] lg:flex-col lg:gap-4">
          {/* 신청 폼 */}
          <div className="w-full sm:w-[300px] lg:w-full shrink-0 flex flex-col gap-4">
            <TextField
              placeholder="이름, 학번등을 입력해주세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              rightIcon={<Search />}
            />
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
              <TextButton variant="disabled" size="wide">
                신청하기
              </TextButton>
              <p className="text-text-4 text-sub-2">
                ※ 홈베이스 신청시 연속 신청이 가능해요
              </p>
            </div>
          </div>

          {/* 오늘 나의 예약 */}
          <div className="flex-1 flex flex-col gap-3">
            <span className="text-text-3 font-semibold text-main-text text-center">
              오늘 나의 예약
            </span>
            {myReservation ? (
              <ReservationTableItem reservation={myReservation} isOwn />
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <span className="text-sub-2 text-text-4">
                  아직 예약을 안하셨어요!
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {reservations !== undefined && (
        <div className="flex flex-col gap-4 mt-4">
          <span className="text-text-2 font-semibold text-main-text">
            예약현황
          </span>
          <div className="flex flex-wrap gap-3 items-start">
            {reservations.length === 0 ? (
              <span className="text-text-3 text-sub-2">
                현재 모든 테이블 예약이 가능합니다
              </span>
            ) : (
              reservations.map((item) => (
                <ReservationTableItem
                  key={`${item.tableName}-${item.floor}`}
                  reservation={item}
                />
              ))
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
