"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ClubFormField } from "@/entities/club/model/club";
import {
  createClubApplicationRequest,
  getSortedClubFormFields,
  type ClubApplicationFieldValue,
  type ClubApplicationFormValues,
} from "../lib/clubApplicationForm";
import { createClubApplicationSchema } from "../lib/clubApplicationSchema";
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
  const validation = createClubApplicationSchema(sortedFields).safeParse(values);
  const canSubmit = !applyMutation.isPending;

  const handleFieldChange = (
    fieldId: number,
    value: ClubApplicationFieldValue,
  ) => {
    setValues((prev) => ({ ...prev, [String(fieldId)]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (applyMutation.isPending) {
      return;
    }

    if (!validation.success) {
      toast.warning(
        validation.error.issues[0]?.message ?? "입력값을 확인해주세요",
      );
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
