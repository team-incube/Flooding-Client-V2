"use client";

import { useState } from "react";
import HomeBase from "@/shared/asset/svg/HomeBase";
import Search from "@/shared/asset/svg/Search";
import TextField from "@/shared/ui/textField";
import { TextButton } from "@/shared/ui/Button/TextButton";
import { SecondFloor } from "@/shared/ui/homebase/SecondFloor";
import { ThirdFloor } from "@/shared/ui/homebase/ThirdFloor";
import { FourthFloor } from "@/shared/ui/homebase/FourthFloor";

const FLOORS = ["2층", "3층", "4층"];
const PERIODS = ["8교시", "9교시", "10교시", "11교시"];

export default function HomebaseCard() {
  const [selectedFloor, setSelectedFloor] = useState("2층");
  const [selectedPeriod, setSelectedPeriod] = useState("8교시");
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");

  const renderFloor = () => {
    switch (selectedFloor) {
      case "2층":
        return <SecondFloor />;
      case "3층":
        return <ThirdFloor />;
      case "4층":
        return <FourthFloor />;
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

            <TextButton
              variant="disabled"
              size="wide"
              className="!w-[300px] lg:!w-[330px]"
            >
              신청하기
            </TextButton>
          </div>

          <div className="flex-1 flex flex-col gap-3 items-center justify-center lg:hidden">
            <span className="font-semibold text-sub-1 text-text-2">
              오늘 나의 예약
            </span>
            <div className="flex flex-1 items-center justify-center">
              <span className="text-sub-2 text-text-4">
                아직 예약을 안하셨어요!
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
