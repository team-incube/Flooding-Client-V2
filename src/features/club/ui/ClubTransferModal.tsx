"use client";

import { TextButton } from "@/shared/ui/Button/TextButton";
import type { ClubMember } from "@/entities/club/model/club";

interface ClubTransferModalProps {
  open: boolean;
  targetMember: ClubMember | null;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ClubTransferModal({
  open,
  targetMember,
  isPending,
  onClose,
  onConfirm,
}: ClubTransferModalProps) {
  if (!open || !targetMember) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/40 z-50">
      <div className="flex flex-col gap-6 bg-background-surface rounded-2xl p-6 w-[90%] max-w-sm">
        <span className="text-main-text text-text-1">소유권 위임</span>
        <p className="text-text-2 text-sub-1">
          <span className="text-p-1">{targetMember.name}</span>
          에게 동아리 (부장)을 위임하겠습니까?
        </p>
        <div className="flex justify-end gap-3">
          <TextButton variant="outlined" size="medium" onClick={onClose}>
            뒤로가기
          </TextButton>
          <TextButton
            variant={isPending ? "disabled" : "filled"}
            size="medium"
            onClick={isPending ? undefined : onConfirm}
          >
            위임하기
          </TextButton>
        </div>
      </div>
    </div>
  );
}
