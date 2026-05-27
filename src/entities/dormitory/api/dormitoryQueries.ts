import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { instance } from "@/shared/api/instance";
import {
  getDormitoryMusic,
  getMassageApplicants,
  getSelfStudyApplicants,
  getMyPenalties,
  getAllPenalties,
  getCleaningZones,
  getCleaningZoneDetail,
} from "@/entities/dormitory/api/getDormitory";
import type {
  MusicApplyRequest,
  UpdatePenaltyRequest,
  CreateCleaningZoneRequest,
  AttendanceStreamStatus,
} from "@/entities/dormitory/model/dormitory";

export const dormitoryQueries = {
  music: (date?: string) =>
    queryOptions({
      queryKey: ["dormitory", "music", date],
      queryFn: () => getDormitoryMusic(date),
    }),

  massage: () =>
    queryOptions({
      queryKey: ["dormitory", "massage"],
      queryFn: getMassageApplicants,
      refetchOnMount: "always",
      refetchOnWindowFocus: "always",
    }),

  study: () =>
    queryOptions({
      queryKey: ["dormitory", "study"],
      queryFn: getSelfStudyApplicants,
      refetchOnMount: "always",
      refetchOnWindowFocus: "always",
    }),

  // 자습 체크인 SSE 연결 상태. study 키의 하위가 아닌 형제 키로 둬
  // study invalidate 시 함께 무효화되지 않도록 한다.
  studyAttendanceStream: () =>
    queryOptions({
      queryKey: ["dormitory", "study-attendance-stream"],
      queryFn: (): AttendanceStreamStatus => "connecting",
      staleTime: Infinity,
      gcTime: Infinity,
    }),

  myPenalties: () =>
    queryOptions({
      queryKey: ["dormitory", "penalties", "me"],
      queryFn: getMyPenalties,
    }),

  allPenalties: () =>
    queryOptions({
      queryKey: ["dormitory", "penalties"],
      queryFn: getAllPenalties,
    }),

  cleaningZones: () =>
    queryOptions({
      queryKey: ["dormitory", "cleaning-zones"],
      queryFn: getCleaningZones,
    }),

  cleaningZoneDetail: (zoneId: number) =>
    queryOptions({
      queryKey: ["dormitory", "cleaning-zones", zoneId],
      queryFn: () => getCleaningZoneDetail(zoneId),
    }),
} as const;

const requests = {
  applyMusic: (body: MusicApplyRequest) =>
    instance.post("/dormitory/music", body),

  likeMusic: (musicId: number) =>
    instance.post(`/dormitory/music/${musicId}/like`),

  cancelLikeMusic: (musicId: number) =>
    instance.delete(`/dormitory/music/${musicId}/like`),

  deleteMusic: (musicId: number) =>
    instance.delete(`/dormitory/music/${musicId}`),

  applyMassage: () => instance.post("/dormitory/massages"),

  cancelMassage: () => instance.delete("/dormitory/massages"),

  applyStudy: () => instance.post("/dormitory/studies"),

  cancelStudy: () => instance.delete("/dormitory/studies"),

  submitInquiry: (body: { content: string }) =>
    instance.post("/dormitory/inquiry", body),

  banStudy: (userId: number) =>
    instance.post(`/dormitory/studies/ban/${userId}`),

  unbanStudy: (userId: number) =>
    instance.delete(`/dormitory/studies/ban/${userId}`),

  checkStudyAttendance: (userId: number) =>
    instance.post(`/dormitory/studies/attendance/${userId}`),

  uncheckStudyAttendance: (userId: number) =>
    instance.delete(`/dormitory/studies/attendance/${userId}`),

  updatePenalties: (userId: number, body: UpdatePenaltyRequest) =>
    instance.put(`/dormitory/penalties/${userId}`, body),

  createCleaningZone: (body: CreateCleaningZoneRequest) =>
    instance.post("/dormitory/cleaning-zones", body),
};

export const dormitoryMutations = {
  applyMusic: () =>
    mutationOptions({
      mutationKey: ["dormitory", "music-apply"],
      mutationFn: requests.applyMusic,
    }),

  likeMusic: () =>
    mutationOptions({
      mutationKey: ["dormitory", "music-like"],
      mutationFn: requests.likeMusic,
    }),

  cancelLikeMusic: () =>
    mutationOptions({
      mutationKey: ["dormitory", "music-unlike"],
      mutationFn: requests.cancelLikeMusic,
    }),

  deleteMusic: () =>
    mutationOptions({
      mutationKey: ["dormitory", "music-delete"],
      mutationFn: requests.deleteMusic,
    }),

  applyMassage: () =>
    mutationOptions({
      mutationKey: ["dormitory", "massage-apply"],
      mutationFn: requests.applyMassage,
    }),

  cancelMassage: () =>
    mutationOptions({
      mutationKey: ["dormitory", "massage-cancel"],
      mutationFn: requests.cancelMassage,
    }),

  applyStudy: () =>
    mutationOptions({
      mutationKey: ["dormitory", "study-apply"],
      mutationFn: requests.applyStudy,
    }),

  cancelStudy: () =>
    mutationOptions({
      mutationKey: ["dormitory", "study-cancel"],
      mutationFn: requests.cancelStudy,
    }),

  submitInquiry: () =>
    mutationOptions({
      mutationKey: ["dormitory", "inquiry-submit"],
      mutationFn: requests.submitInquiry,
    }),

  banStudy: () =>
    mutationOptions({
      mutationKey: ["dormitory", "study-ban"],
      mutationFn: requests.banStudy,
    }),

  unbanStudy: () =>
    mutationOptions({
      mutationKey: ["dormitory", "study-unban"],
      mutationFn: requests.unbanStudy,
    }),

  checkStudyAttendance: () =>
    mutationOptions({
      mutationKey: ["dormitory", "study-attendance-check"],
      mutationFn: requests.checkStudyAttendance,
    }),

  uncheckStudyAttendance: () =>
    mutationOptions({
      mutationKey: ["dormitory", "study-attendance-uncheck"],
      mutationFn: requests.uncheckStudyAttendance,
    }),

  updatePenalties: () =>
    mutationOptions({
      mutationKey: ["dormitory", "penalties-update"],
      mutationFn: (args: { userId: number; body: UpdatePenaltyRequest }) =>
        requests.updatePenalties(args.userId, args.body),
    }),

  createCleaningZone: () =>
    mutationOptions({
      mutationKey: ["dormitory", "cleaning-zone-create"],
      mutationFn: requests.createCleaningZone,
    }),
} as const;

export { requests as dormitoryRequests };
