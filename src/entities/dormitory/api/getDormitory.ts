import { instance } from '@/shared/api/instance';
import type { 
  DormitoryStudent, 
  DormitoryMusic, 
  MyPenaltyResponse, 
  AllPenaltiesResponse, 
  CleaningZones, 
  CleaningZoneDetail 
} from '@/entities/dormitory/model/dormitory';

type DormitoryMusicResponseItem = Omit<DormitoryMusic, "isLiked"> & {
  isLiked?: boolean;
};
type DormitoryMusicResponse =
  | DormitoryMusicResponseItem[]
  | { data?: DormitoryMusicResponseItem[] };

export async function getDormitoryMusic(date?: string): Promise<DormitoryMusic[]> {
  const { data } = await instance.get<DormitoryMusicResponse>('/dormitory/music', {
    params: date ? { date } : undefined,
  });

  const musicList = Array.isArray(data) ? data : data.data ?? [];

  return musicList.map((music) => ({
    ...music,
    isLiked: music.isLiked ?? false,
  }));
}

type DormitoryStudentResponse = DormitoryStudent[] | { data?: DormitoryStudent[] };

export async function getMassageApplicants(): Promise<DormitoryStudent[]> {
  const { data } = await instance.get<DormitoryStudentResponse>('/dormitory/massages');
  return Array.isArray(data) ? data : (data.data ?? []);
}

export async function getSelfStudyApplicants(): Promise<DormitoryStudent[]> {
  const { data } = await instance.get<DormitoryStudentResponse>('/dormitory/studies');
  return Array.isArray(data) ? data : (data.data ?? []);
}

export async function getMyPenalties(): Promise<MyPenaltyResponse> {
  const { data } = await instance.get<MyPenaltyResponse>('/dormitory/penalties/me');
  return data;
}

export async function getAllPenalties(): Promise<AllPenaltiesResponse> {
  const { data } = await instance.get<AllPenaltiesResponse>('/dormitory/penalties');
  return data;
}

export async function getCleaningZones(): Promise<CleaningZones[]> {
  const { data } = await instance.get<CleaningZones []>('/dormitory/cleaning-zones');
  return data;
}

export async function getCleaningZoneDetail(zoneId: number): Promise<CleaningZoneDetail> {
  const { data } = await instance.get<CleaningZoneDetail>('/dormitory/cleaning-zones/' + zoneId);
  return data;
}
