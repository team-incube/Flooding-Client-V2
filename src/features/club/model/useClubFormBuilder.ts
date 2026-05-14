"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { ClubForm, ClubFormFieldType } from "@/entities/club/model/club";
import {
  createClubFormDraftState,
  createClubFormRequest,
  createDefaultClubFormField,
  createDefaultClubFormFieldOption,
  needsClubFormFieldOptions,
  type ClubFormFieldDraft,
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
  const initialDraftState = initialForm
    ? createClubFormDraftState(initialForm)
    : undefined;
  const mutation = mode === "edit" ? updateMutation : createMutation;
  const [title, setTitle] = useState(initialDraftState?.title ?? "");
  const [description, setDescription] = useState(
    initialDraftState?.description ?? "",
  );
  const [fields, setFields] = useState<ClubFormFieldDraft[]>(
    initialDraftState?.fields ?? [createDefaultClubFormField(1)],
  );
  const [nextFieldId, setNextFieldId] = useState(
    initialDraftState?.nextFieldId ?? 2,
  );
  const [nextOptionId, setNextOptionId] = useState(
    initialDraftState?.nextOptionId ?? 1,
  );
  const validation = clubFormDraftSchema.safeParse({
    title,
    description,
    fields,
  });
  const canSubmit = canCreateForm && validation.success && !mutation.isPending;

  const handleTitleChange = (value: string) => {
    setTitle(value);
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
  };

  const handleAddField = () => {
    setFields((prev) => [...prev, createDefaultClubFormField(nextFieldId)]);
    setNextFieldId((prev) => prev + 1);
  };

  const handleRemoveField = (fieldId: number) => {
    setFields((prev) => prev.filter((field) => field.id !== fieldId));
  };

  const handleFieldChange = (
    fieldId: number,
    key: ClubFormFieldDraftKey,
    value: string | boolean,
  ) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === fieldId ? { ...field, [key]: value } : field,
      ),
    );
  };

  const handleFieldTypeChange = (
    fieldId: number,
    fieldType: ClubFormFieldType,
  ) => {
    const optionId = nextOptionId;

    setFields((prev) =>
      prev.map((field) => {
        if (field.id !== fieldId) {
          return field;
        }

        if (!needsClubFormFieldOptions(fieldType)) {
          return { ...field, fieldType, options: [] };
        }

        return {
          ...field,
          fieldType,
          options:
            field.options.length > 0
              ? field.options
              : [createDefaultClubFormFieldOption(optionId)],
        };
      }),
    );

    if (needsClubFormFieldOptions(fieldType)) {
      setNextOptionId((prev) => prev + 1);
    }
  };

  const handleAddOption = (fieldId: number) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === fieldId
          ? {
              ...field,
              options: [
                ...field.options,
                createDefaultClubFormFieldOption(nextOptionId),
              ],
            }
          : field,
      ),
    );
    setNextOptionId((prev) => prev + 1);
  };

  const handleRemoveOption = (fieldId: number, optionId: number) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === fieldId
          ? {
              ...field,
              options: field.options.filter((option) => option.id !== optionId),
            }
          : field,
      ),
    );
  };

  const handleOptionChange = (
    fieldId: number,
    optionId: number,
    key: ClubFormFieldOptionDraftKey,
    value: string,
  ) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === fieldId
          ? {
              ...field,
              options: field.options.map((option) =>
                option.id === optionId ? { ...option, [key]: value } : option,
              ),
            }
          : field,
      ),
    );
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!canCreateForm || mutation.isPending) {
      return;
    }

    const parsed = clubFormDraftSchema.safeParse({
      title,
      description,
      fields,
    });

    if (!parsed.success) {
      return;
    }

    mutation.mutate(
      createClubFormRequest({
        title: parsed.data.title,
        description: parsed.data.description,
        fields: parsed.data.fields,
      }),
      {
        onSuccess: () => router.push(`/club/${clubId}/apply`),
      },
    );
  };

  return {
    title,
    description,
    fields,
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
