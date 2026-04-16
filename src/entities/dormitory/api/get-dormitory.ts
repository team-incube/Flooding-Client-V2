import { instance } from "@/shared/api/instance";
import type { DormitoryStudent, DormitoryMusic } from "../model/types";

export async function getDormitoryMusic(): Promise<DormitoryMusic[]> {
  const { data } = await instance.get<DormitoryMusic[]>("/dormitory/music");
  return data;
}

export async function getMassageApplicants(): Promise<DormitoryStudent[]> {
  const { data } = await instance.get<DormitoryStudent[]>("/dormitory/massage");
  return data;
}

export async function getSelfStudyApplicants(): Promise<DormitoryStudent[]> {
  const { data } = await instance.get<DormitoryStudent[]>("/dormitory/study");
  return data;
}

export async function getMyPenalties() {
  const { data } = await instance.get("/dormitory/penalties/me");
  return data;
}

export async function getAllPenalties() {
  const { data } = await instance.get("/dormitory/penalties");
  return data;
}

export async function getCleaningZones() {
  const { data } = await instance.get("/dormitory/cleaning-zones");
  return data;
}

export async function getCleaningZoneDetail(zoneId: number) {
  const { data } = await instance.get(`/dormitory/cleaning-zones/${zoneId}`);
  return data;
}
