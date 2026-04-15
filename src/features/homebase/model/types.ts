export interface HomebaseMember {
  studentNumber: string;
  name: string;
}

export interface HomebaseReservation {
  id: number;
  startPeriod: number;
  endPeriod: number;
  homebaseId: number;
  reason: string;
  members: HomebaseMember[];
}

export interface HomebaseApplyRequest {
  homebaseId: number;
  startPeriod: number;
  endPeriod: number;
  reason: string;
  members: HomebaseMember[];
}

export interface HomebasePatchRequest {
  members: HomebaseMember[];
}
