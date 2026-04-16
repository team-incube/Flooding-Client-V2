import { instance } from '@/shared/api/instance';
import type { 
  DormitoryStudent, 
  DormitoryMusic, 
  MyPenaltyResponse, 
  AllPenaltiesResponse, 
  CleaningZone, 
  CleaningZoneDetail 
} from '../model/dormitory';

export async function getDormitoryMusic(): Promise<DormitoryMusic[]> {
  const { data } = await instance.get<DormitoryMusic[]>('/dormitory/music');
  return data;
}

export async function getMassageApplicants(): Promise<DormitoryStudent[]> {
  const { data } = await instance.get<DormitoryStudent[]>('/dormitory/massage');
  return data;
}

export async function getSelfStudyApplicants(): Promise<DormitoryStudent[]> {
  const { data } = await instance.get<DormitoryStudent[]>('/dormitory/study');
  return data;
}

export async function getMyPenalties(): Promise<MyPenaltyResponse> {
  const { data } = await instance.get<MyPenaltyResponse>('/dormitory/penalties/me');
  return data;
}

export async function getAllPenalties(): Promise<AllPenaltiesResponse> {
  const { data } = await instance.get<AllPenaltiesResponse>('/dormitory/penalties');
  return data;
}

export async function getCleaningZones(): Promise<CleaningZone[]> {
  const { data } = await instance.get<CleaningZone[]>('/dormitory/cleaning-zones');
  return data;
}

export async function getCleaningZoneDetail(zoneId: number): Promise<CleaningZoneDetail> {
  const { data } = await instance.get<CleaningZoneDetail>('/dormitory/cleaning-zones/' + zoneId);
  return data;
}