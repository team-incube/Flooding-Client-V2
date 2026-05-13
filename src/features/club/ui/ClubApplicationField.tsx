import TextField from "@/shared/ui/textField";
import type { ClubFormField } from "@/entities/club/model/club";
import type { ClubApplicationFieldValue } from "../lib/clubApplicationForm";

interface ClubApplicationFieldProps {
  field: ClubFormField;
  value: ClubApplicationFieldValue | undefined;
  onChange: (value: ClubApplicationFieldValue) => void;
}

const optionStyles = {
  selected: "border-p-1 bg-p-2 text-p-1",
  default: "border-sub-2 bg-background-surface text-sub-1",
};

const fieldContainerStyles = "flex flex-col gap-2";
const fieldLabelStyles = "text-text-3 text-main-text";
const fieldDescriptionStyles = "text-caption-1 text-sub-1";
const fieldBoxStyles =
  "w-full rounded-lg border border-sub-2 bg-background-surface px-4 py-3 text-main-text outline-none placeholder:text-sub-2 focus:border-sub-1 caret-p-1";

export function ClubApplicationField({
  field,
  value,
  onChange,
}: ClubApplicationFieldProps) {
  const fieldInputId = `field-${field.fieldId}`;
  const textValue = typeof value === "string" ? value : "";
  const selectedValues = Array.isArray(value) ? value : [];

  const toggleCheckbox = (optionValue: string) => {
    const nextValues = selectedValues.includes(optionValue)
      ? selectedValues.filter((selectedValue) => selectedValue !== optionValue)
      : [...selectedValues, optionValue];

    onChange(nextValues);
  };

  return (
    <div className={fieldContainerStyles}>
      <div className="flex flex-col gap-1">
        <label htmlFor={fieldInputId} className={fieldLabelStyles}>
          {field.label}
          {field.required && <span className="text-p-1"> *</span>}
        </label>
        {field.description && (
          <p className={fieldDescriptionStyles}>{field.description}</p>
        )}
      </div>

      {field.fieldType === "TEXT" && (
        <TextField
          id={fieldInputId}
          value={textValue}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.fieldType === "TEXTAREA" && (
        <textarea
          id={fieldInputId}
          value={textValue}
          onChange={(e) => onChange(e.target.value)}
          className={`${fieldBoxStyles} min-h-[120px] resize-y`}
        />
      )}

      {field.fieldType === "RADIO" && (
        <div className="flex flex-wrap gap-2">
          {field.options.map((option) => {
            const isSelected = textValue === option.value;
            const state = isSelected ? "selected" : "default";

            return (
              <label
                key={option.optionId}
                className={`text-text-4 flex h-[43px] cursor-pointer items-center justify-center rounded-lg border px-4 ${optionStyles[state]}`}
              >
                <input
                  type="radio"
                  name={`field-${field.fieldId}`}
                  value={option.value}
                  checked={isSelected}
                  onChange={() => onChange(option.value)}
                  className="sr-only"
                />
                {option.label}
              </label>
            );
          })}
        </div>
      )}

      {field.fieldType === "CHECKBOX" && (
        <div className="flex flex-wrap gap-2">
          {field.options.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            const state = isSelected ? "selected" : "default";

            return (
              <label
                key={option.optionId}
                className={`text-text-4 flex h-[43px] cursor-pointer items-center justify-center rounded-lg border px-4 ${optionStyles[state]}`}
              >
                <input
                  type="checkbox"
                  value={option.value}
                  checked={isSelected}
                  onChange={() => toggleCheckbox(option.value)}
                  className="sr-only"
                />
                {option.label}
              </label>
            );
          })}
        </div>
      )}

      {field.fieldType === "DROPDOWN" && (
        <select
          id={fieldInputId}
          value={textValue}
          onChange={(e) => onChange(e.target.value)}
          className={`${fieldBoxStyles} h-[52px]`}
        >
          <option value="">선택해주세요</option>
          {field.options.map((option) => (
            <option key={option.optionId} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
