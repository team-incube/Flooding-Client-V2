import { instance } from "@/shared/api/instance";
import type {
  DormitoryMusic,
  DormitoryMusicQueryParams,
  MassageApplicants,
  StudyApplicants,
  MyPenaltyResponse,
  AllPenaltiesResponse,
  CleaningZones,
  CleaningZoneDetail,
} from "@/entities/dormitory/model/dormitory";

type DormitoryMusicResponseItem = Omit<DormitoryMusic, "isLiked"> & {
  isLiked?: boolean;
};
type DormitoryMusicResponse =
  | DormitoryMusicResponseItem[]
  | { data?: DormitoryMusicResponseItem[] }
  | { data?: { data?: DormitoryMusicResponseItem[] } };

export async function getDormitoryMusic(
  date?: string,
  queryParams?: DormitoryMusicQueryParams,
): Promise<DormitoryMusic[]> {
  const { data } = await instance.get<DormitoryMusicResponse>(
    "/dormitory/music",
    {
      params: {
        ...(date ? { date } : {}),
        ...(queryParams ? queryParams : {}),
      },
    },
  );

  const musicList = Array.isArray(data)
    ? data
    : Array.isArray(data.data)
      ? data.data
      : Array.isArray(data.data?.data)
        ? data.data.data
        : [];

  return musicList.map((music) => ({
    ...music,
    isLiked: music.isLiked ?? false,
  }));
}

type ApiResponse<TData> = {
  status: string;
  code: number;
  message: string;
  data: TData;
};

export async function getMassageApplicants(): Promise<MassageApplicants> {
  const { data } = await instance.get<ApiResponse<MassageApplicants>>(
    "/dormitory/massages",
  );
  return data.data;
}

export async function getSelfStudyApplicants(): Promise<StudyApplicants> {
  const { data } =
    await instance.get<ApiResponse<StudyApplicants>>("/dormitory/studies");
  return data.data;
}

export async function getMyPenalties(): Promise<MyPenaltyResponse> {
  const { data } = await instance.get<MyPenaltyResponse>(
    "/dormitory/penalties/me",
  );
  return data;
}

export async function getAllPenalties(): Promise<AllPenaltiesResponse> {
  const { data } = await instance.get<AllPenaltiesResponse>(
    "/dormitory/penalties",
  );
  return data;
}

export async function getCleaningZones(): Promise<CleaningZones[]> {
  const { data } = await instance.get<CleaningZones[]>(
    "/dormitory/cleaning-zones",
  );
  return data;
}

export async function getCleaningZoneDetail(
  zoneId: number,
): Promise<CleaningZoneDetail> {
  const { data } = await instance.get<CleaningZoneDetail>(
    "/dormitory/cleaning-zones/" + zoneId,
  );
  return data;
}
