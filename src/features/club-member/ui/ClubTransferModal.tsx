"use client";

import { ConfirmModal } from "@/shared/ui/ConfirmModal";
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
  return (
    <ConfirmModal
      open={open && targetMember !== null}
      title="소유권 위임"
      description={
        targetMember ? (
          <>
            <span className="text-p-1">{targetMember.name}</span>
            에게 동아리 (부장)을 위임하겠습니까?
          </>
        ) : null
      }
      confirmLabel="위임하기"
      isPending={isPending}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}
