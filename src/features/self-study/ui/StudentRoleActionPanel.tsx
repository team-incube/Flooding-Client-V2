"use client";

import { ASSIGNABLE_ROLES } from "@/entities/user/lib/userRole";
import type { UserRole } from "@/entities/user/model/user";
import { TextButton } from "@/shared/ui/Button/TextButton";
import { Dropdown } from "@/shared/ui/Dropdown";

interface StudentRoleActionPanelProps {
  hasSelectedStudent: boolean;
  selectedRole: UserRole | "";
  isPending: boolean;
  onSelectRole: (role: UserRole | "") => void;
  onChangeRole: () => void;
}

const ROLE_PLACEHOLDER = "역할을 선택해주세요";

export function StudentRoleActionPanel({
  hasSelectedStudent,
  selectedRole,
  isPending,
  onSelectRole,
  onChangeRole,
}: StudentRoleActionPanelProps) {
  const isDisabled = !hasSelectedStudent || isPending;
  const isActionEnabled =
    hasSelectedStudent && selectedRole !== "" && !isPending;
  const triggerLabel =
    ASSIGNABLE_ROLES.find((role) => role.value === selectedRole)?.label ??
    ROLE_PLACEHOLDER;
  const triggerStateStyle = isDisabled
    ? "border-sub-3 bg-surface text-sub-2 cursor-default opacity-50"
    : selectedRole !== ""
      ? "border-p-1 text-p-1 cursor-pointer"
      : "border-sub-3 text-sub-2 hover:bg-surface cursor-pointer";

  return (
    <div className="flex flex-col gap-3">
      <span className="text-main-text text-text-3">권한 변경</span>
      <Dropdown
        options={ASSIGNABLE_ROLES}
        selectedValue={selectedRole === "" ? null : selectedRole}
        onSelect={onSelectRole}
        triggerLabel={triggerLabel}
        triggerClassName={`text-text-4 h-[47px] w-full justify-between rounded-lg border px-4 ${triggerStateStyle}`}
        disabled={isDisabled}
        align="stretch"
      />
      <TextButton
        variant={isActionEnabled ? "filled" : "disabled"}
        size="wide"
        onClick={onChangeRole}
      >
        권한 변경
      </TextButton>
    </div>
  );
}
