"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { homebaseMutations, homebaseQueries } from "@/entities/homebase/api/homebaseQueries";
import {
  getHomebaseId,
  getHomebaseLocation,
  toSchoolReservation,
} from "@/entities/homebase/lib/homebaseReservation";
import type { HomebaseApplyRequest } from "@/entities/homebase/model/homebase";
import { ReservationTableItem } from "@/entities/school/ui/ReservationTableItem";
import type { User } from "@/entities/user/model/user";
import { getMaxPersonnel } from "@/features/homebase/lib/getMaxPersonnel";
import { isPeriodStarted } from "@/features/homebase/lib/isPeriodStarted";
import { FLOORS, PERIODS } from "@/features/homebase/model/constants";
import { FourthFloor } from "@/features/homebase/ui/FourthFloor";
import SelectedStudent from "@/features/homebase/ui/SelectedStudent";
import { SecondFloor } from "@/features/homebase/ui/SecondFloor";
import StudentSearch from "@/features/homebase/ui/StudentSearch";
import { ThirdFloor } from "@/features/homebase/ui/ThirdFloor";
import HomeBase from "@/shared/asset/svg/HomeBase";
import Search from "@/shared/asset/svg/Search";
import { TextButton } from "@/shared/ui/Button/TextButton";
import TextField from "@/shared/ui/textField";

interface HomebaseCardProps {
  showReservations?: boolean;
}

export default function HomebaseCard({
  showReservations = false,
}: HomebaseCardProps) {
  const [selectedFloor, setSelectedFloor] = useState("2F");
  const [selectedPeriod, setSelectedPeriod] = useState("8교시");
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<User[]>([]);

  const queryClient = useQueryClient();
  const { data: reservations = [] } = useQuery(homebaseQueries.list());

  const applyMutation = useMutation({
    mutationFn: ({
      homebaseId,
      body,
    }: {
      homebaseId: number;
      body: HomebaseApplyRequest;
    }) => homebaseMutations.apply(homebaseId, body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["homebase", "list"] }),
  });

  const cancelMutation = useMutation({
    mutationFn: (homebaseId: number) => homebaseMutations.cancel(homebaseId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["homebase", "list"] }),
  });

  const handleFloorChange = (floor: string) => {
    setSelectedFloor(floor);
    setSelectedTable(null);
  };

  const handleNameChange = (value: string) => {
    setName(value);
  };

  const handleReasonChange = (value: string) => {
    setReason(value);
  };

  const handlePeriodSelect = (period: string) => {
    if (!isPeriodStarted(period)) {
      setSelectedPeriod(period);
    }
  };

  const maxPersonnel = getMaxPersonnel(selectedFloor, selectedTable);
  const isFull = maxPersonnel > 0 && selectedStudents.length >= maxPersonnel;
  const canSubmit =
    selectedTable !== null && isFull && reason.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit || !selectedTable) return;

    const periodIndex = PERIODS.indexOf(selectedPeriod);
    const startPeriod = 8 + periodIndex;
    const homebaseId = getHomebaseId(selectedFloor, selectedTable);

    if (!homebaseId) return;

    applyMutation.mutate({
      homebaseId,
      body: {
        homebaseId,
        startPeriod,
        endPeriod: startPeriod,
        reason,
        members: selectedStudents.map((student) => ({
          studentNumber: String(student.studentNumber),
          name: student.name,
        })),
      },
    });
  };

  const filteredReservations = reservations
    .filter(
      (reservation) =>
        getHomebaseLocation(reservation.homebaseId).floor === selectedFloor,
    )
    .map(toSchoolReservation);

  const myReservationSource = reservations[0];
  const myReservation = myReservationSource
    ? toSchoolReservation(myReservationSource)
    : null;

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
            variant={
              isPeriodStarted(period)
                ? "disabled"
                : selectedPeriod === period
                  ? "filled"
                  : "outlined"
            }
            onClick={() => handlePeriodSelect(period)}
          >
            {period}
          </TextButton>
        ))}
      </div>

      <div className="mt-3 flex flex-col items-start gap-6 lg:flex-row 2xl:justify-between">
        <div className="w-full min-w-0 lg:flex-1">{renderFloor()}</div>

        <div className="flex w-full flex-col gap-6 sm:flex-row lg:w-[330px] lg:shrink-0 lg:flex-col lg:gap-4">
          <div className="flex w-full shrink-0 flex-col gap-4 sm:w-[300px] lg:w-full">
            <div className="flex flex-col gap-1">
              <TextField
                placeholder="이름, 학번등을 입력해주세요"
                value={name}
                onChange={(event) => handleNameChange(event.target.value)}
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
                onChange={(event) => handleReasonChange(event.target.value)}
                className="h-[120px] w-full resize-none rounded-lg border border-sub-2 bg-background-surface p-4 text-main-text outline-none transition-all caret-p-1 placeholder:text-sub-2 focus:border-sub-1"
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
            <div className="flex flex-1 flex-col gap-3">
              <span className="text-center text-text-2 font-semibold text-sub-1">
                내 예약현황
              </span>
              {myReservation && myReservationSource ? (
                <ReservationTableItem
                  reservation={myReservation}
                  isOwn
                  onDelete={() =>
                    cancelMutation.mutate(myReservationSource.homebaseId)
                  }
                  onEdit={() => {}}
                />
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

      {showReservations && (
        <div className="mt-4 flex flex-col gap-4">
          <span className="text-text-2 font-semibold text-main-text">
            예약현황
          </span>
          <div className="flex flex-wrap items-start gap-3">
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
