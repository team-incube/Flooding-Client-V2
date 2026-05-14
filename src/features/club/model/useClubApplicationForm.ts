"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { ClubFormField } from "@/entities/club/model/club";
import {
  canSubmitClubApplication,
  createClubApplicationRequest,
  getSortedClubFormFields,
  type ClubApplicationFieldValue,
  type ClubApplicationFormValues,
} from "../lib/clubApplicationForm";
import { useApplyClub } from "./useApplyClub";

interface UseClubApplicationFormParams {
  clubId: number;
  fields: ClubFormField[];
}

export function useClubApplicationForm({
  clubId,
  fields,
}: UseClubApplicationFormParams) {
  const router = useRouter();
  const [values, setValues] = useState<ClubApplicationFormValues>({});
  const applyMutation = useApplyClub(clubId);
  const sortedFields = getSortedClubFormFields(fields);
  const canSubmit = canSubmitClubApplication({
    fields: sortedFields,
    values,
    isPending: applyMutation.isPending,
  });

  const handleFieldChange = (
    fieldId: number,
    value: ClubApplicationFieldValue,
  ) => {
    setValues((prev) => ({ ...prev, [String(fieldId)]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!canSubmit) {
      return;
    }

    applyMutation.mutate(createClubApplicationRequest(sortedFields, values), {
      onSuccess: () => router.push(`/club/${clubId}`),
    });
  };

  return {
    values,
    fields: sortedFields,
    canSubmit,
    handleFieldChange,
    handleSubmit,
  };
}
