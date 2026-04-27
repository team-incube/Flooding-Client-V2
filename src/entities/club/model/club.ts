import { Sex } from "@/entities/user/model/user";

export type ClubType = "MAJOR_CLUB" | "AUTONOMOUS_CLUB";

export interface Club {
  id: number;
  name: string;
  type: ClubType;
  leader?: string;
  description: string;
  imageUrl?: string;
  totalMember: number;
}

export interface ClubListResponse {
  club: Club[];
}

export interface ClubDetail {
  id: number;
  name: string;
  type: ClubType;
  leader?: string;
  description: string;
  imageUrl?: string;
  maxMember?: number;
}

export interface ClubMember {
  id: number;
  name: string;
  studentNumber: number;
  sex: Sex;
}

export interface ProjectParticipant {
  id: number;
  name?: string;
  studentNumber?: number;
  sex: Sex;
}

export interface ProjectLink {
  type: string;
  link: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  participants: ProjectParticipant[];
  links?: ProjectLink[];
}

export interface ClubDetailResponse {
  club: ClubDetail;
  members: ClubMember[];
  projects: Project[];
  isLeader: boolean;
}

export type ClubFormFieldType =
  | "TEXT"
  | "TEXTAREA"
  | "RADIO"
  | "CHECKBOX"
  | "DROPDOWN";

export interface ClubFormFieldOption {
  optionId: number;
  label: string;
  value: string;
}

export interface ClubFormField {
  fieldId: number;
  label: string;
  description?: string;
  fieldType: ClubFormFieldType;
  order: number;
  required: boolean;
  options: ClubFormFieldOption[];
}

export interface ClubForm {
  formId: number;
  title: string;
  description?: string;
  fields: ClubFormField[];
}

export interface CreateClubFormFieldOptionRequest {
  label: string;
  value: string;
}

export interface CreateClubFormFieldRequest {
  label: string;
  description?: string;
  fieldType: ClubFormFieldType;
  order: number;
  required: boolean;
  options?: CreateClubFormFieldOptionRequest[];
}

export interface CreateClubFormRequest {
  title: string;
  description?: string;
  fields: CreateClubFormFieldRequest[];
}

export interface CreateClubFormResponse {
  formId: number;
}

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
