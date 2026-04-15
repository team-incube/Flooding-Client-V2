"use client";

import HomeBase from "@/shared/asset/svg/HomeBase";
import Search from "@/shared/asset/svg/Search";
import TextField from "@/shared/ui/textField";
import { TextButton } from "@/shared/ui/Button/TextButton";
import { SecondFloor } from "@/shared/ui/homebase/SecondFloor";
import { ThirdFloor } from "@/shared/ui/homebase/ThirdFloor";
import { FourthFloor } from "@/shared/ui/homebase/FourthFloor";
import StudentSearch from "@/features/homebase/ui/StudentSearch";
import SelectedStudent from "@/features/homebase/ui/SelectedStudent";
import { ReservationTableItem } from "@/entities/school/ui/ReservationTableItem";
import { MOCK_MY_RESERVATION } from "@/entities/school/model/mock";
import { FLOORS, PERIODS } from "@/features/homebase/model/constants";
import { isPeriodStarted } from "@/features/homebase/lib/isPeriodStarted";
import { useHomebaseForm } from "@/features/homebase/model/useHomebaseForm";

export default function HomebaseCard({
  showReservations = false,
}: {
  showReservations?: boolean;
}) {
  const {
    selectedFloor,
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
  } = useHomebaseForm();

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
                <ReservationTableItem key={item.id} reservation={item} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
