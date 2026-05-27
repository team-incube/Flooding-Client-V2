"use client";

import { ReservationTableItem } from "@/entities/school/ui/ReservationTableItem";
import { FLOORS, PERIODS } from "@/features/homebase/model/constants";
import { useHomebaseReservation } from "@/features/homebase/model/useHomebaseReservation";
import { FourthFloor } from "@/features/homebase/ui/FourthFloor";
import { SelectedStudent } from "@/entities/user/ui/SelectedStudent";
import { SecondFloor } from "@/features/homebase/ui/SecondFloor";
import { StudentSearch } from "@/entities/user/ui/StudentSearch";
import { ThirdFloor } from "@/features/homebase/ui/ThirdFloor";
import HomeBase from "@/shared/asset/svg/HomeBase";
import Search from "@/shared/asset/svg/Search";
import { TextButton } from "@/shared/ui/Button/TextButton";
import { Skeleton } from "@/shared/ui/Skeleton";
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
    isError,
    isApplicationClosed,
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

  const othersReservations =
    myReservationIds.size > 0
      ? filteredReservations.filter((item) => !myReservationIds.has(item.id))
      : filteredReservations;

  const floorProps = {
    selectedTable,
    onTableSelect: handleTableSelect,
    reservedTables,
  };

  return (
    <div className="bg-background-surface flex w-full flex-col rounded-2xl p-6">
      <div className="flex items-center gap-1">
        <HomeBase />
        <span className="text-text-1 text-main-text font-semibold">
          홈베이스
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="text-text-3 text-sub-1 font-medium">층</span>
          {FLOORS.map(({ value, label }) => (
            <TextButton
              key={value}
              variant={
                isApplicationClosed
                  ? "disabled"
                  : selectedFloor === value
                    ? "filled"
                    : "outlined"
              }
              className="w-fit! min-w-[68px]! px-4 sm:min-w-[91px]!"
              onClick={() => handleFloorChange(value)}
            >
              {label}
            </TextButton>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="text-text-3 text-sub-1 font-medium">교시</span>
          {PERIODS.map((period) => (
            <TextButton
              key={period}
              variant={getPeriodButtonVariant(period)}
              className="w-fit! min-w-[68px]! px-4 sm:min-w-[91px]!"
              onClick={() => handlePeriodSelect(period)}
            >
              {period}
            </TextButton>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-col items-start gap-6 lg:flex-row 2xl:justify-between">
        <div className="flex w-full min-w-0 flex-col gap-4 lg:flex-1">
          {selectedFloor === "2F" && <SecondFloor {...floorProps} />}
          {selectedFloor === "3F" && <ThirdFloor {...floorProps} />}
          {selectedFloor === "4F" && <FourthFloor {...floorProps} />}
        </div>

        <div className="flex w-full min-w-0 flex-col gap-6 lg:w-82.5 lg:shrink-0 lg:gap-4">
          <div className="flex w-full min-w-0 flex-col gap-4 lg:w-full">
            <div className="relative">
              <TextField
                placeholder="이름, 학번 등을 입력해주세요"
                value={name}
                onChange={(event) => handleNameChange(event.target.value)}
                onKeyDown={handleNameKeyDown}
                rightIcon={<Search />}
              />
              <div className="absolute top-full right-0 left-0 z-10 mt-1">
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
                className="border-sub-2 bg-background-surface text-main-text caret-p-1 placeholder:text-sub-2 focus:border-sub-1 h-30 w-full resize-none rounded-lg border p-4 outline-none"
              />
              <span className="text-size-caption-1 text-sub-2 text-right">
                {reason.length}/20
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <TextButton
                variant={canSubmit ? "filled" : "disabled"}
                size="wide"
                className="w-full!"
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
                  : "※ 테이블을 선택하면 여러 교시를 선택할 수 있어요"}
              </span>
            </div>
          </div>

          <SelectedStudent
            selectedStudents={selectedStudents}
            onRemoveStudent={handleRemoveStudent}
          />
        </div>
      </div>

      {showMyReservationStatus && (
        <div className="mt-4 flex flex-col gap-3">
          <span className="text-text-2 text-main-text font-semibold">
            내 예약현황
          </span>
          {isLoading ? (
            <Skeleton className="h-16 w-full rounded-xl" />
          ) : isError ? (
            <span className="text-text-4 text-negative">
              예약현황을 불러오지 못했습니다
            </span>
          ) : myReservationItems.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {myReservationItems.map(({ reservationId, reservation }) => (
                <ReservationTableItem
                  key={reservationId}
                  reservation={reservation}
                  isOwn
                  onDelete={() => handleDeleteReservation(reservationId)}
                />
              ))}
            </div>
          ) : (
            <span className="text-text-4 text-sub-2">
              아직 예약을 안하셨어요!
            </span>
          )}
        </div>
      )}

      {showAllReservationStatus && (
        <div className="mt-4 flex flex-col gap-4">
          <span className="text-text-2 text-main-text font-semibold">
            예약현황
          </span>
          <div className="flex flex-wrap items-start gap-3">
            {isLoading ? (
              <>
                <Skeleton className="h-16 w-48 rounded-xl" />
                <Skeleton className="h-16 w-48 rounded-xl" />
                <Skeleton className="h-16 w-48 rounded-xl" />
              </>
            ) : isError ? (
              <span className="text-text-3 text-negative">
                예약현황을 불러오지 못했습니다
              </span>
            ) : othersReservations.length === 0 ? (
              <span className="text-text-3 text-sub-2">
                현재 모든 테이블 예약이 가능합니다
              </span>
            ) : (
              othersReservations.map((item) => (
                <ReservationTableItem key={item.id} reservation={item} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
