"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { ClubFormFieldType } from "@/entities/club/model/club";
import {
  createClubFormRequest,
  createDefaultClubFormField,
  createDefaultClubFormFieldOption,
  isClubFormFieldDraftValid,
  needsClubFormFieldOptions,
  type ClubFormFieldDraft,
  type ClubFormFieldDraftKey,
  type ClubFormFieldOptionDraftKey,
} from "../lib/clubFormBuilder";
import { useCreateClubForm } from "./useCreateClubForm";

interface UseClubFormBuilderParams {
  clubId: number;
  canCreateForm: boolean;
}

export function useClubFormBuilder({
  clubId,
  canCreateForm,
}: UseClubFormBuilderParams) {
  const router = useRouter();
  const createMutation = useCreateClubForm(clubId);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<ClubFormFieldDraft[]>([
    createDefaultClubFormField(1),
  ]);
  const [nextFieldId, setNextFieldId] = useState(2);
  const [nextOptionId, setNextOptionId] = useState(1);
  const canSubmit =
    canCreateForm &&
    !!title.trim() &&
    fields.length > 0 &&
    fields.every(isClubFormFieldDraftValid) &&
    !createMutation.isPending;

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

    if (!canSubmit) {
      return;
    }

    createMutation.mutate(
      createClubFormRequest({
        title,
        description,
        fields,
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
