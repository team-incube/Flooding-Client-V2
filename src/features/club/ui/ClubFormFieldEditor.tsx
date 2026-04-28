import TextField from "@/shared/ui/textField";
import type { ClubFormFieldType } from "@/entities/club/model/club";
import {
  clubFormFieldTypeOptions,
  isClubFormFieldOptionValueValid,
  needsClubFormFieldOptions,
  type ClubFormFieldDraft,
  type ClubFormFieldDraftKey,
  type ClubFormFieldOptionDraftKey,
} from "../lib/clubFormBuilder";

interface ClubFormFieldEditorProps {
  field: ClubFormFieldDraft;
  index: number;
  isOnlyField: boolean;
  onRemoveField: (fieldId: number) => void;
  onFieldChange: (
    fieldId: number,
    key: ClubFormFieldDraftKey,
    value: string | boolean,
  ) => void;
  onFieldTypeChange: (
    fieldId: number,
    fieldType: ClubFormFieldType,
  ) => void;
  onAddOption: (fieldId: number) => void;
  onRemoveOption: (fieldId: number, optionId: number) => void;
  onOptionChange: (
    fieldId: number,
    optionId: number,
    key: ClubFormFieldOptionDraftKey,
    value: string,
  ) => void;
}

const fieldBoxStyles =
  "w-full rounded-lg border border-sub-2 bg-background-surface px-4 py-3 text-main-text outline-none transition-all placeholder:text-sub-2 focus:border-sub-1 caret-p-1";

const secondaryButtonStyles =
  "h-[43px] rounded-lg border border-sub-2 bg-background-surface px-4 text-text-4 text-sub-1 transition-all hover:border-sub-1";

export function ClubFormFieldEditor({
  field,
  index,
  isOnlyField,
  onRemoveField,
  onFieldChange,
  onFieldTypeChange,
  onAddOption,
  onRemoveOption,
  onOptionChange,
}: ClubFormFieldEditorProps) {
  const fieldLabelInputId = `club-form-field-label-${field.id}`;
  const fieldTypeInputId = `club-form-field-type-${field.id}`;
  const fieldDescriptionInputId = `club-form-field-description-${field.id}`;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-sub-3 bg-background p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-text-1 text-main-text">질문 {index + 1}</span>
        <button
          type="button"
          className={secondaryButtonStyles}
          onClick={() => onRemoveField(field.id)}
          disabled={isOnlyField}
        >
          삭제
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_180px]">
        <div className="flex flex-col gap-1">
          <label htmlFor={fieldLabelInputId} className="text-text-3 text-main-text">
            질문 제목 <span className="text-p-1">*</span>
          </label>
          <TextField
            id={fieldLabelInputId}
            value={field.label}
            placeholder="질문을 입력해주세요"
            onChange={(e) => onFieldChange(field.id, "label", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={fieldTypeInputId} className="text-text-3 text-main-text">
            질문 타입
          </label>
          <select
            id={fieldTypeInputId}
            value={field.fieldType}
            onChange={(e) =>
              onFieldTypeChange(
                field.id,
                e.target.value as ClubFormFieldType,
              )
            }
            className={`${fieldBoxStyles} h-[52px]`}
          >
            {clubFormFieldTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor={fieldDescriptionInputId} className="text-text-3 text-main-text">
          질문 설명
        </label>
        <TextField
          id={fieldDescriptionInputId}
          value={field.description}
          placeholder="선택 입력"
          onChange={(e) =>
            onFieldChange(field.id, "description", e.target.value)
          }
        />
      </div>

      <label className="flex w-fit cursor-pointer items-center gap-2 text-text-4 text-sub-1">
        <input
          type="checkbox"
          checked={field.required}
          onChange={(e) =>
            onFieldChange(field.id, "required", e.target.checked)
          }
          className="size-4 accent-p-1"
        />
        필수 질문
      </label>

      {needsClubFormFieldOptions(field.fieldType) && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-text-3 text-main-text">
              선택지 <span className="text-p-1">*</span>
            </span>
            <button
              type="button"
              className={secondaryButtonStyles}
              onClick={() => onAddOption(field.id)}
            >
              선택지 추가
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {field.options.map((option) => (
              <div
                key={option.id}
                className="grid gap-2 lg:grid-cols-[1fr_1fr_auto]"
              >
                <TextField
                  id={`club-form-field-option-label-${field.id}-${option.id}`}
                  value={option.label}
                  placeholder="표시 이름"
                  onChange={(e) =>
                    onOptionChange(
                      field.id,
                      option.id,
                      "label",
                      e.target.value,
                    )
                  }
                />
                <div className="flex flex-col gap-1">
                  <TextField
                    id={`club-form-field-option-value-${field.id}-${option.id}`}
                    value={option.value}
                    placeholder="전송 값"
                    onChange={(e) =>
                      onOptionChange(
                        field.id,
                        option.id,
                        "value",
                        e.target.value,
                      )
                    }
                  />
                  {option.value && !isClubFormFieldOptionValueValid(option.value) && (
                    <p className="text-caption-2 text-negative">
                      전송 값에는 쉼표(,)를 사용할 수 없어요.
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  className={secondaryButtonStyles}
                  onClick={() => onRemoveOption(field.id, option.id)}
                  disabled={field.options.length === 1}
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
