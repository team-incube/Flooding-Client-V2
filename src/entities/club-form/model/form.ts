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
