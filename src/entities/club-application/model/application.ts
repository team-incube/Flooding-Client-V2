export interface ClubApplicationAnswerRequest {
  fieldId: number;
  value?: string;
}

export interface ClubApplicationRequest {
  answers: ClubApplicationAnswerRequest[];
}

export interface ClubApplicationResponse {
  applicationId: number;
}

export interface ClubApplicantInfo {
  id: number;
  name: string;
  studentNumber: number;
}

export interface ClubApplicationAnswer {
  fieldId: number;
  label: string;
  value?: string;
}

export interface ClubApplicationSummary {
  submissionId: number;
  applicant: ClubApplicantInfo;
  submittedAt: string;
  answers: ClubApplicationAnswer[];
}

export interface ClubApplicationListResponse {
  applications: ClubApplicationSummary[];
}
