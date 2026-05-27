"use client";

import { useReducer, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ClubForm, ClubFormFieldType } from "@/entities/club-form/model/form";
import {
  clubFormDraftReducer,
  createClubFormDraftState,
  createClubFormRequest,
  createDefaultClubFormDraftState,
  type ClubFormFieldDraftKey,
  type ClubFormFieldOptionDraftKey,
} from "../lib/clubFormBuilder";
import { clubFormDraftSchema } from "../lib/clubFormSchema";
import { useCreateClubForm } from "./useCreateClubForm";
import { useUpdateClubForm } from "./useUpdateClubForm";

interface UseClubFormBuilderParams {
  clubId: number;
  canCreateForm: boolean;
  mode?: "create" | "edit";
  initialForm?: ClubForm;
}

export function useClubFormBuilder({
  clubId,
  canCreateForm,
  mode = "create",
  initialForm,
}: UseClubFormBuilderParams) {
  const router = useRouter();
  const createMutation = useCreateClubForm(clubId);
  const updateMutation = useUpdateClubForm(clubId);
  const mutation = mode === "edit" ? updateMutation : createMutation;
  const [draft, dispatch] = useReducer(
    clubFormDraftReducer,
    initialForm,
    (form) =>
      form ? createClubFormDraftState(form) : createDefaultClubFormDraftState(),
  );
  const validation = clubFormDraftSchema.safeParse({
    title: draft.title,
    description: draft.description,
    fields: draft.fields,
  });
  const canSubmit = canCreateForm && !mutation.isPending;

  const handleTitleChange = (value: string) => {
    dispatch({ type: "SET_TITLE", value });
  };

  const handleDescriptionChange = (value: string) => {
    dispatch({ type: "SET_DESCRIPTION", value });
  };

  const handleAddField = () => {
    dispatch({ type: "ADD_FIELD" });
  };

  const handleRemoveField = (fieldId: number) => {
    dispatch({ type: "REMOVE_FIELD", fieldId });
  };

  const handleFieldChange = (
    fieldId: number,
    key: ClubFormFieldDraftKey,
    value: string | boolean,
  ) => {
    dispatch({ type: "SET_FIELD", fieldId, key, value });
  };

  const handleFieldTypeChange = (
    fieldId: number,
    fieldType: ClubFormFieldType,
  ) => {
    dispatch({ type: "SET_FIELD_TYPE", fieldId, fieldType });
  };

  const handleAddOption = (fieldId: number) => {
    dispatch({ type: "ADD_OPTION", fieldId });
  };

  const handleRemoveOption = (fieldId: number, optionId: number) => {
    dispatch({ type: "REMOVE_OPTION", fieldId, optionId });
  };

  const handleOptionChange = (
    fieldId: number,
    optionId: number,
    key: ClubFormFieldOptionDraftKey,
    value: string,
  ) => {
    dispatch({ type: "SET_OPTION", fieldId, optionId, key, value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!canCreateForm || mutation.isPending) {
      return;
    }

    if (!validation.success) {
      toast.warning(
        validation.error.issues[0]?.message ?? "입력값을 확인해주세요",
      );
      return;
    }

    mutation.mutate(
      createClubFormRequest({
        title: validation.data.title,
        description: validation.data.description,
        fields: validation.data.fields,
      }),
      {
        onSuccess: () => router.push(`/club/${clubId}/apply`),
      },
    );
  };

  return {
    title: draft.title,
    description: draft.description,
    fields: draft.fields,
    canSubmit,
    handleTitleChange,
    handleDescriptionChange,
    handleAddField,
    handleRemoveField,
    handleFieldChange,
    handleFieldTypeChange,
    handleAddOption,
    handleRemoveOption,
    handleOptionChange,
    handleSubmit,
  };
}
