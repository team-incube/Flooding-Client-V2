import { dormitoryQueries } from "@/entities/dormitory/api/dormitoryQueries";
import { attendanceResponseSchema } from "@/entities/dormitory/lib/dormitorySchemas";
import { createStudyPermission } from "@/entities/dormitory/lib/studyPermission";
import type {
  AttendanceStreamStatus,
  StudyApplicants,
} from "@/entities/dormitory/model/dormitory";
import { z } from "zod";
import type { UserRole } from "@/entities/user/model/user";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { openAuthorizedSse } from "@/shared/api/authorizedSse";

export function useStudyAttendanceSubscription(role?: UserRole) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const studyPermission = createStudyPermission({ role });
    if (!studyPermission.canCheckAttendance) return;

    const streamKey = dormitoryQueries.studyAttendanceStream().queryKey;

    const setStreamStatus = (next: AttendanceStreamStatus) => {
      const prev = queryClient.getQueryData<AttendanceStreamStatus>(streamKey);
      if (prev === next) return;

      queryClient.setQueryData<AttendanceStreamStatus>(streamKey, next);

      // 재연결 시도 중 onerror가 반복 발생하므로 error 상태 첫 진입 시에만 알린다.
      if (next === "error" && prev !== "error") {
        toast.error("실시간 연결이 끊겼습니다. 자동으로 다시 연결합니다.");
      }
      if (next === "open" && prev === "error") {
        toast.success("실시간 연결이 복구되었습니다.");
      }
    };

    const updateStudyCache = (
      updater: (prev: StudyApplicants) => StudyApplicants,
    ) => {
      queryClient.setQueryData<StudyApplicants>(
        dormitoryQueries.study().queryKey,
        (prev) => (prev ? updater(prev) : prev),
      );
    };

    const handleInitEvent = (event: MessageEvent<string>) => {
      const result = z
        .array(attendanceResponseSchema)
        .safeParse(JSON.parse(event.data));
      if (!result.success) return;
      const checkedIds = new Set(result.data.map((r) => r.userId));
      updateStudyCache((prev) => ({
        ...prev,
        applicants: prev.applicants.map((a) => ({
          ...a,
          isChecked: checkedIds.has(a.userId),
        })),
      }));
    };

    const handleAttendanceEvent = (event: MessageEvent<string>) => {
      const result = attendanceResponseSchema.safeParse(JSON.parse(event.data));
      if (!result.success) return;
      const { userId } = result.data;
      updateStudyCache((prev) => ({
        ...prev,
        applicants: prev.applicants.map((a) =>
          a.userId === userId ? { ...a, isChecked: true } : a,
        ),
      }));
    };

    const handleCancelAttendanceEvent = (event: MessageEvent<string>) => {
      const result = attendanceResponseSchema.safeParse(JSON.parse(event.data));
      if (!result.success) return;
      const { userId } = result.data;
      updateStudyCache((prev) => ({
        ...prev,
        applicants: prev.applicants.map((a) =>
          a.userId === userId ? { ...a, isChecked: false } : a,
        ),
      }));
    };

    setStreamStatus("connecting");

    return openAuthorizedSse({
      path: "/api/dormitory/studies/attendance",
      listeners: {
        init: handleInitEvent,
        attendance: handleAttendanceEvent,
        "cancel-attendance": handleCancelAttendanceEvent,
      },
      onOpen: () => setStreamStatus("open"),
      onError: () => setStreamStatus("error"),
    });
  }, [queryClient, role]);
}
