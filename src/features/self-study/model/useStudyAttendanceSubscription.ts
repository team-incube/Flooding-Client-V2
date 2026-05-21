import { dormitoryQueries } from "@/entities/dormitory/api/dormitoryQueries";
import { createStudyPermission } from "@/entities/dormitory/lib/studyPermission";
import type {
  AttendanceResponse,
  StudyApplicants,
} from "@/entities/dormitory/model/dormitory";
import type { UserRole } from "@/entities/user/model/user";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useStudyAttendanceSubscription(role?: UserRole) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const studyPermission = createStudyPermission({ role });
    if (!studyPermission.canCheckAttendance) return;

    const accessToken = sessionStorage.getItem("access_token");
    const searchParams = new URLSearchParams();
    if (accessToken) searchParams.set("accessToken", accessToken);

    const eventSource = new EventSource(
      `/api/dormitory/studies/attendance?${searchParams.toString()}`,
    );

    const updateStudyCache = (updater: (prev: StudyApplicants) => StudyApplicants) => {
      queryClient.setQueryData<StudyApplicants>(
        dormitoryQueries.study().queryKey,
        (prev) => (prev ? updater(prev) : prev),
      );
    };

    const handleInitEvent = (event: MessageEvent<string>) => {
      const checkedIds = new Set(
        (JSON.parse(event.data) as AttendanceResponse[]).map((r) => r.userId),
      );
      updateStudyCache((prev) => ({
        ...prev,
        applicants: prev.applicants.map((a) => ({ ...a, isChecked: checkedIds.has(a.userId) })),
      }));
    };

    const handleAttendanceEvent = (event: MessageEvent<string>) => {
      const { userId } = JSON.parse(event.data) as AttendanceResponse;
      updateStudyCache((prev) => ({
        ...prev,
        applicants: prev.applicants.map((a) =>
          a.userId === userId ? { ...a, isChecked: true } : a,
        ),
      }));
    };

    const handleCancelAttendanceEvent = (event: MessageEvent<string>) => {
      const { userId } = JSON.parse(event.data) as AttendanceResponse;
      updateStudyCache((prev) => ({
        ...prev,
        applicants: prev.applicants.map((a) =>
          a.userId === userId ? { ...a, isChecked: false } : a,
        ),
      }));
    };

    eventSource.addEventListener("init", handleInitEvent);
    eventSource.addEventListener("attendance", handleAttendanceEvent);
    eventSource.addEventListener("cancel-attendance", handleCancelAttendanceEvent);

    return () => {
      eventSource.removeEventListener("init", handleInitEvent);
      eventSource.removeEventListener("attendance", handleAttendanceEvent);
      eventSource.removeEventListener("cancel-attendance", handleCancelAttendanceEvent);
      eventSource.close();
    };
  }, [queryClient, role]);

  const markChecked = (studentId: number) => {
    queryClient.setQueryData<StudyApplicants>(
      dormitoryQueries.study().queryKey,
      (prev) =>
        prev
          ? {
              ...prev,
              applicants: prev.applicants.map((a) =>
                a.userId === studentId ? { ...a, isChecked: true } : a,
              ),
            }
          : prev,
    );
  };

  const markUnchecked = (studentId: number) => {
    queryClient.setQueryData<StudyApplicants>(
      dormitoryQueries.study().queryKey,
      (prev) =>
        prev
          ? {
              ...prev,
              applicants: prev.applicants.map((a) =>
                a.userId === studentId ? { ...a, isChecked: false } : a,
              ),
            }
          : prev,
    );
  };

  return { markChecked, markUnchecked };
}
