"use client";

import { ReservationTableItem } from "@/entities/school/ui/ReservationTableItem";
import { FLOORS, PERIODS } from "@/features/homebase/model/constants";
import { useHomebaseReservation } from "@/features/homebase/model/useHomebaseReservation";
import { FourthFloor } from "@/features/homebase/ui/FourthFloor";
import { SelectedStudent } from "@/features/homebase/ui/SelectedStudent";
import { SecondFloor } from "@/features/homebase/ui/SecondFloor";
import { StudentSearch } from "@/features/homebase/ui/StudentSearch";
import { ThirdFloor } from "@/features/homebase/ui/ThirdFloor";
import HomeBase from "@/shared/asset/svg/HomeBase";
import Search from "@/shared/asset/svg/Search";
import { TextButton } from "@/shared/ui/Button/TextButton";
import TextField from "@/shared/ui/textField";

interface HomebaseCardProps {
  showMyReservationStatus?: boolean;
  showAllReservationStatus?: boolean;
}

export default function HomebaseCard({
  showMyReservationStatus = false,
  showAllReservationStatus = false,
}: HomebaseCardProps) {
  const {
    selectedFloor,
    selectedTable,
    name,
    reason,
    triedToOverfill,
    maxPersonnel,
    isFull,
    isStudentFull,
    filteredStudents,
    reservedTables,
    filteredReservations,
    myReservationItems,
    myReservationIds,
    isLoading,
    canSubmit,
    selectedStudents,
    handleFloorChange,
    handleTableSelect,
    handleNameChange,
    handleStudentAdd,
    handleNameKeyDown,
    handleRemoveStudent,
    handleReasonChange,
    handlePeriodSelect,
    getPeriodButtonVariant,
    handleSubmit,
    handleDeleteReservation,
  } = useHomebaseReservation();

  const renderFloor = () => {
    switch (selectedFloor) {
      case "2F":
        return (
          <SecondFloor
            selectedTable={selectedTable}
            onTableSelect={handleTableSelect}
            reservedTables={reservedTables}
          />
        );
      case "3F":
        return (
          <ThirdFloor
            selectedTable={selectedTable}
            onTableSelect={handleTableSelect}
            reservedTables={reservedTables}
          />
        );
      case "4F":
        return (
          <FourthFloor
            selectedTable={selectedTable}
            onTableSelect={handleTableSelect}
            reservedTables={reservedTables}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex w-full flex-col rounded-2xl bg-background-surface p-6">
      <div className="flex items-center gap-1">
        <HomeBase />
        <span className="text-text-1 font-semibold text-main-text">
          홈베이스
        </span>
      </div>

      <div className="mt-4 flex items-center gap-3">
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
            variant={getPeriodButtonVariant(period)}
            onClick={() => handlePeriodSelect(period)}
          >
            {period}
          </TextButton>
        ))}
      </div>

      <div className="mt-3 flex flex-col items-start gap-6 lg:flex-row 2xl:justify-between">
        <div className="w-full min-w-0 lg:flex-1">{renderFloor()}</div>

        <div className="flex w-full flex-col gap-6 sm:flex-row lg:w-82.5 lg:shrink-0 lg:flex-col lg:gap-4">
          <div className="flex w-full shrink-0 flex-col gap-4 sm:w-75 lg:w-full">
            <div className="relative">
              <TextField
                placeholder="이름, 학번등을 입력해주세요"
                value={name}
                onChange={(event) => handleNameChange(event.target.value)}
                onKeyDown={handleNameKeyDown}
                rightIcon={<Search />}
              />
              <div className="absolute left-0 right-0 top-full z-10 mt-1">
                <StudentSearch
                  filteredStudents={filteredStudents}
                  isFull={isStudentFull}
                  onSelect={handleStudentAdd}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <textarea
                placeholder="이용 사유를 적어주세요"
                value={reason}
                maxLength={20}
                onChange={(event) => handleReasonChange(event.target.value)}
                className="h-30 w-full resize-none rounded-lg border border-sub-2 bg-background-surface p-4 text-main-text outline-none transition-all caret-p-1 placeholder:text-sub-2 focus:border-sub-1"
              />
              <span className="text-right text-size-caption-1 text-sub-2">
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
                  triedToOverfill && isFull ? "text-negative" : "text-sub-2"
                }
              >
                {triedToOverfill && isFull
                  ? `※ 테이블 ${selectedTable}번의 최대인원은 ${maxPersonnel}명입니다`
                  : "※ 홈베이스 신청시 연속 신청이 가능해요"}
              </span>
            </div>
          </div>

          <SelectedStudent
            selectedStudents={selectedStudents}
            onRemoveStudent={handleRemoveStudent}
          />

          {showMyReservationStatus && (
            <div className="flex flex-1 flex-col gap-3">
              <span className="text-center text-text-2 font-semibold text-main-text">
                내 예약현황
              </span>
              {isLoading ? (
                <div className="h-16 w-full animate-pulse rounded-xl bg-background-surface" />
              ) : myReservationItems.length > 0 ? (
                myReservationItems.map(({ reservationId, reservation }) => (
                  <ReservationTableItem
                    key={reservationId}
                    reservation={reservation}
                    isOwn
                    onDelete={() => handleDeleteReservation(reservationId)}
                  />
                ))
              ) : (
                <div className="flex flex-1 items-center justify-center">
                  <span className="text-text-4 text-sub-2">
                    아직 예약을 안하셨어요!
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showAllReservationStatus && (
        <div className="mt-4 flex flex-col gap-4">
          <span className="text-text-2 font-semibold text-main-text">
            예약현황
          </span>
          <div className="flex flex-wrap items-start gap-3">
            {isLoading ? (
              <>
                <div className="h-16 w-48 animate-pulse rounded-xl bg-background-surface" />
                <div className="h-16 w-48 animate-pulse rounded-xl bg-background-surface" />
                <div className="h-16 w-48 animate-pulse rounded-xl bg-background-surface" />
              </>
            ) : filteredReservations.length === 0 ? (
              <span className="text-text-3 text-sub-2">
                현재 모든 테이블 예약이 가능합니다
              </span>
            ) : (
              filteredReservations.map((item) => (
                <ReservationTableItem
                  key={item.id}
                  reservation={item}
                  isOwn={myReservationIds.has(item.id)}
                  onDelete={
                    myReservationIds.has(item.id)
                      ? () => handleDeleteReservation(item.id)
                      : undefined
                  }
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
