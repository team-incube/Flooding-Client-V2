"use client";

import { useState } from "react";
import HomeBase from "@/shared/asset/svg/HomeBase";
import Search from "@/shared/asset/svg/Search";
import TextField from "@/shared/ui/textField";
import { TextButton } from "@/shared/ui/Button/TextButton";
import { SecondFloor } from "@/shared/ui/homebase/SecondFloor";
import { ThirdFloor } from "@/shared/ui/homebase/ThirdFloor";
import { FourthFloor } from "@/shared/ui/homebase/FourthFloor";
import StudentSearch from "@/features/homebase/ui/StudentSearch"
import { User } from "@/entities/user/model/user";
import SelectedStudent from "@/features/homebase/ui/SelectedStudent";

const FLOORS = ["2층", "3층", "4층"];
const PERIODS = ["8교시", "9교시", "10교시", "11교시"];

const PERIODS_TIME: Record<string, string> = {
  "8교시": "16:40",
  "9교시": "17:40",
  "10교시": "19:30",
  "11교시": "20:30"
}

export const TABLE_MAX_PERSONNEL = {
  "2층": { "1": 6, "2": 4, "3": 4 },
  "3층": { "1": 6, "2": 6, "3": 4, "5": 4, "6": 4 },
  "4층": { "1": 8, "2": 4 },
} as const;

export default function HomebaseCard() {
  const [selectedFloor, setSelectedFloor] = useState("2층");
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

  const renderFloor = () => {
    switch (selectedFloor) {
      case "2층":
        return (
          <SecondFloor 
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
          />
        )
      case "3층":
        return (
          <ThirdFloor 
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
          />
        )
      case "4층":
        return (
          <FourthFloor 
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
          />
        )
    }
  };

  const maxPersonnel = selectedTable
  ? TABLE_MAX_PERSONNEL[selectedFloor as keyof typeof TABLE_MAX_PERSONNEL]?.[selectedTable as keyof typeof TABLE_MAX_PERSONNEL[keyof typeof TABLE_MAX_PERSONNEL]] ?? 0
  : 0;
  const isFull = selectedStudents.length >= maxPersonnel;
  const canSubmit = selectedTable && isFull && reason.trim().length > 0;

  return (
    <div className="w-full bg-background-surface rounded-2xl p-4 2xl:p-6 flex flex-col">
      <div className="flex items-center gap-1">
        <HomeBase />
        <span className="text-text-1 font-semibold text-main-text">
          홈베이스
        </span>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <span className="text-text-3 font-medium text-sub-1">층</span>
        {FLOORS.map((floor) => (
          <TextButton
            key={floor}
            variant={selectedFloor === floor ? "filled" : "outlined"}
            onClick={() => setSelectedFloor(floor)}
          >
            {floor}
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
              if (!isPeriodStarted(period)) {
                setSelectedPeriod(period)
              }
            }}
          >
            {period}
          </TextButton>
        ))}
      </div>

      <div className="flex justify-between items-start gap-6 mt-3">
        {renderFloor()}

        <div className="w-[330px] flex flex-col gap-4">
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
              size="wide">
              신청하기
            </TextButton>

            <span
              className={`${selectedTable && isFull ? "text-negative" : "text-sub-2"}`}
            >
              {selectedTable && isFull ? `※ 테이블 ${selectedTable}번의 최대인원은 ${maxPersonnel}명입니다`
              : "※ 홈베이스 신청시 연속 신청이 가능해요"}
            </span>
          </div>
          <SelectedStudent
            selectedStudents={selectedStudents}
            setSelectedStudents={setSelectedStudents}
          />
        </div>
      </div>
    </div>
  );
}
