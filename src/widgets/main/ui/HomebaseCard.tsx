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
    <div className="w-[1518px] bg-background-surface rounded-2xl p-4 min-[1600px]:p-6 flex flex-col">
      <div className="flex items-center gap-1">
        <HomeBase />
        <span className="text-size-text-1 font-semibold text-main-text">
          홈베이스
        </span>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <span className="text-size-text-3 font-medium text-sub-1">층</span>
        {FLOORS.map((floor) => (
          <TextButton
            key={floor}
            variant={selectedFloor === floor ? "filled" : "outlined"}
            onClick={() => setSelectedFloor(floor)}
          >
            {floor}
          </TextButton>
        ))}

        <span className="text-size-text-3 font-medium text-sub-1">교시</span>
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

      <div className="flex gap-6 items-start mt-3">
        {renderFloor()}

        <div className="w-[330px] flex flex-col gap-4">
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
              className="w-full h-[120px] rounded-lg border border-sub-2 bg-background-surface text-main-text placeholder:text-sub-2 focus:border-sub-1 outline-none p-4 resize-none caret-[#527CD7] transition-all"
            />
            <span className="text-right text-sub-2 text-size-caption-1">
              {reason.length}/20
            </span>
          </div>

          <TextButton variant="disabled" size="wide">
            신청하기
          </TextButton>
        </div>
      </div>
    </div>
  );
}
