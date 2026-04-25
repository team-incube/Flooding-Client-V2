"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  homebaseMutations,
  homebaseQueries,
} from "@/entities/homebase/api/homebaseQueries";
import {
  getHomebaseId,
  getHomebaseLocation,
  toSchoolReservation,
} from "@/entities/homebase/lib/homebaseReservation";
import type { HomebaseApplyRequest } from "@/entities/homebase/model/homebase";
import { ReservationTableItem } from "@/entities/school/ui/ReservationTableItem";
import { meQuery } from "@/entities/user/api/getMe";
import { MOCK_STUDENTS } from "@/entities/user/model/mock";
import type { User } from "@/entities/user/model/user";
import { getMaxPersonnel } from "@/features/homebase/lib/getMaxPersonnel";
import { filterAvailableStudents } from "@/features/homebase/lib/studentSelection";
import { isPeriodStarted } from "@/features/homebase/lib/isPeriodStarted";
import { FLOORS, PERIODS } from "@/features/homebase/model/constants";
import { FourthFloor } from "@/features/homebase/ui/FourthFloor";
import { SelectedStudent } from "@/features/homebase/ui/SelectedStudent";
import { SecondFloor } from "@/features/homebase/ui/SecondFloor";
import { StudentSearch } from "@/features/homebase/ui/StudentSearch";
import { ThirdFloor } from "@/features/homebase/ui/ThirdFloor";
import HomeBase from "@/shared/asset/svg/HomeBase";
import Search from "@/shared/asset/svg/Search";
import { TextButton } from "@/shared/ui/Button/TextButton";
import TextField from "@/shared/ui/textField";
import { toast } from "sonner";

interface HomebaseCardProps {
  showReservations?: boolean;
}

export default function HomebaseCard({
  showReservations = false,
}: HomebaseCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedFloor = searchParams.get("floor") ?? "2F";
  const [selectedStartPeriod, setSelectedStartPeriod] = useState(
    () =>
      PERIODS.find((p) => !isPeriodStarted(p)) ?? PERIODS[PERIODS.length - 1],
  );
  const [selectedEndPeriod, setSelectedEndPeriod] = useState(
    () =>
      PERIODS.find((p) => !isPeriodStarted(p)) ?? PERIODS[PERIODS.length - 1],
  );
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [triedToOverfill, setTriedToOverfill] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<User[]>([]);

  const queryClient = useQueryClient();
  const { data: currentUser } = useQuery(meQuery);
  const homebaseListQuery = homebaseQueries.list();
  const { data: reservations = [], isLoading } = useQuery(homebaseListQuery);

  const applyMutation = useMutation({
    mutationFn: ({
      homebaseId,
      body,
    }: {
      homebaseId: number;
      body: HomebaseApplyRequest;
    }) => homebaseMutations.apply(homebaseId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: homebaseListQuery.queryKey });
      setSelectedStudents([]);
      setReason("");
      setSelectedTable(null);
      setTriedToOverfill(false);
      toast.success("홈베이스 신청이 완료되었습니다");
    },
    onError: () => toast.error("신청에 실패했습니다. 다시 시도해주세요"),
  });

  const cancelMutation = useMutation({
    mutationFn: (reservationId: number) =>
      homebaseMutations.cancel(reservationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: homebaseListQuery.queryKey });
      toast.success("예약이 취소되었습니다");
    },
    onError: () => toast.error("취소에 실패했습니다. 다시 시도해주세요"),
  });

  const handleFloorChange = (floor: string) => {
    setSelectedTable(null);
    const params = new URLSearchParams(searchParams.toString());
    params.set("floor", floor);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const maxPersonnel = getMaxPersonnel(selectedFloor, selectedTable);
  const isFull =
    maxPersonnel > 0 && selectedStudents.length >= maxPersonnel - 1;

  const filteredStudents = filterAvailableStudents({
    searchKeyword: name,
    selectedStudents,
    students: MOCK_STUDENTS,
  })
    .filter((s) => s.studentNumber !== currentUser?.studentNumber)
    .slice(0, 2);

  const handleNameChange = (value: string) => {
    setName(value);
  };

  const handleStudentAdd = (student: User) => {
    if (!selectedTable) {
      toast.warning("테이블을 먼저 선택해주세요");
      return;
    }
    if (isFull) {
      setTriedToOverfill(true);
      return;
    }
    setTriedToOverfill(false);
    setSelectedStudents((prev) => [...prev, student]);
    setName("");
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filteredStudents.length > 0) {
      handleStudentAdd(filteredStudents[0]);
    }
  };

  const handleReasonChange = (value: string) => {
    setReason(value);
  };

  const handlePeriodSelect = (period: string) => {
    if (isPeriodStarted(period)) return;

    const clickedIdx = PERIODS.indexOf(period);
    const startIdx = PERIODS.indexOf(selectedStartPeriod);
    const endIdx = PERIODS.indexOf(selectedEndPeriod);
    const isSameBlock = Math.floor(clickedIdx / 2) === Math.floor(startIdx / 2);

    if (isSameBlock) {
      if (clickedIdx === startIdx && startIdx !== endIdx) {
        setSelectedStartPeriod(PERIODS[startIdx + 1]);
      } else if (clickedIdx === endIdx && startIdx !== endIdx) {
        setSelectedEndPeriod(PERIODS[endIdx - 1]);
      } else {
        const newMin = Math.min(startIdx, endIdx, clickedIdx);
        const newMax = Math.max(startIdx, endIdx, clickedIdx);
        setSelectedStartPeriod(PERIODS[newMin]);
        setSelectedEndPeriod(PERIODS[newMax]);
      }
    } else {
      setSelectedStartPeriod(period);
      setSelectedEndPeriod(period);
      setSelectedTable(null);
    }
  };

  const selectedStartNum = 8 + PERIODS.indexOf(selectedStartPeriod);
  const selectedEndNum = 8 + PERIODS.indexOf(selectedEndPeriod);
  const hasConflict = reservations.some(
    (r) => r.startPeriod <= selectedEndNum && r.endPeriod >= selectedStartNum,
  );

  const canSubmit = selectedTable !== null;

  const handleSubmit = () => {
    if (!canSubmit || !selectedTable) return;

    if (isPeriodStarted(selectedStartPeriod)) {
      toast.warning("이미 지난 교시는 신청할 수 없습니다");
      return;
    }

    if (!reason.trim()) {
      toast.warning("신청사유를 입력해주세요");
      return;
    }

    if (hasConflict) {
      toast.warning("해당 시간대에 이미 예약이 존재합니다");
      return;
    }

    const startPeriod = selectedStartNum;
    const endPeriod = selectedEndNum;
    const homebaseId = getHomebaseId(selectedFloor, selectedTable);

    if (!homebaseId) return;

    const meMembers = currentUser
      ? [
          {
            studentNumber: String(currentUser.studentNumber),
            name: currentUser.name,
          },
        ]
      : [];

    applyMutation.mutate({
      homebaseId,
      body: {
        startPeriod,
        endPeriod,
        reason,
        members: [
          ...meMembers,
          ...selectedStudents.map((student) => ({
            studentNumber: String(student.studentNumber),
            name: student.name,
          })),
        ],
      },
    });
  };

  const getPeriodVariant = (period: string) => {
    if (isPeriodStarted(period)) return "disabled";
    const idx = PERIODS.indexOf(period);
    const startIdx = PERIODS.indexOf(selectedStartPeriod);
    const endIdx = PERIODS.indexOf(selectedEndPeriod);
    return idx >= Math.min(startIdx, endIdx) &&
      idx <= Math.max(startIdx, endIdx)
      ? "filled"
      : "outlined";
  };

  const reservedTables = reservations
    .filter((r) => {
      const location = getHomebaseLocation(r.homebaseId);
      return (
        location.floor === selectedFloor &&
        r.startPeriod <= selectedEndNum &&
        r.endPeriod >= selectedStartNum
      );
    })
    .reduce<Record<string, string[]>>((acc, r) => {
      const { tableId } = getHomebaseLocation(r.homebaseId);
      acc[tableId] = r.members.map((m) => `${m.studentNumber} ${m.name}`);
      return acc;
    }, {});

  const filteredReservations = reservations
    .filter(
      (reservation) =>
        getHomebaseLocation(reservation.homebaseId).floor === selectedFloor,
    )
    .sort((a, b) => a.startPeriod - b.startPeriod)
    .map(toSchoolReservation);

  const myReservationSource = currentUser
    ? reservations.find((r) =>
        r.members.some(
          (m) => m.studentNumber === String(currentUser.studentNumber),
        ),
      )
    : null;
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
            reservedTables={reservedTables}
          />
        );
      case "3F":
        return (
          <ThirdFloor
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
            reservedTables={reservedTables}
          />
        );
      case "4F":
        return (
          <FourthFloor
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
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
            variant={getPeriodVariant(period)}
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
            <div className="flex flex-col gap-1">
              <TextField
                placeholder="이름, 학번등을 입력해주세요"
                value={name}
                onChange={(event) => handleNameChange(event.target.value)}
                onKeyDown={handleNameKeyDown}
                rightIcon={<Search />}
              />
              <StudentSearch
                filteredStudents={filteredStudents}
                isFull={isFull}
                onSelect={handleStudentAdd}
              />
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
            setSelectedStudents={setSelectedStudents}
          />

          {showReservations && (
            <div className="flex flex-1 flex-col gap-3">
              <span className="text-center text-text-2 font-semibold text-main-text">
                내 예약현황
              </span>
              {isLoading ? (
                <div className="h-16 w-full animate-pulse rounded-xl bg-background-surface" />
              ) : myReservation && myReservationSource ? (
                <ReservationTableItem
                  reservation={myReservation}
                  isOwn
                  onDelete={() => cancelMutation.mutate(myReservationSource.id)}
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
                  isOwn={item.id === myReservationSource?.id}
                  onDelete={
                    item.id === myReservationSource?.id
                      ? () => cancelMutation.mutate(myReservationSource.id)
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
