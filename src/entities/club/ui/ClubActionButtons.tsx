import { useState } from "react";
import { TextButton } from "@/shared/ui/Button/TextButton";

interface ClubActionButtonsProps {
  isEdit: boolean;
  isPendingApproval: boolean;
  canDelete: boolean;
  isApprovalPending: boolean;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onApprove: (approved: boolean) => void;
}

export function ClubActionButtons({
  isEdit,
  isPendingApproval,
  canDelete,
  isApprovalPending,
  onSave,
  onCancel,
  onDelete,
  onApprove,
}: ClubActionButtonsProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (isEdit) {
    return (
      <>
        <div className="flex gap-1 w-[362px]">
          <TextButton size="wide" variant="ghost" onClick={onCancel}>
            돌아가기
          </TextButton>
          {canDelete && (
            <TextButton
              size="wide"
              variant="negative"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              동아리 삭제
            </TextButton>
          )}
          <TextButton
            size="wide"
            variant="filled"
            onClick={onSave}
          >
            저장
          </TextButton>
        </div>

        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/50">
            <div className="flex flex-col gap-3 w-full max-w-md rounded-2xl bg-background-surface p-6 text-text-1">
              <span className="text-negative font-bold">동아리 삭제</span>
              <span className="text-main-text">동아리를 삭제하시겠습니까?</span>
              <div className="flex gap-2">
                <TextButton
                  size="wide"
                  variant="ghost"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  뒤로가기
                </TextButton>
                <TextButton
                  size="wide"
                  variant="negative"
                  onClick={() => {
                    onDelete();
                    setIsDeleteModalOpen(false);
                  }}
                >
                  삭제하기
                </TextButton>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  if (isPendingApproval) {
    return (
      <div className="flex gap-1 w-[240px]">
        <TextButton
          size="wide"
          variant="negative"
          onClick={() => onApprove(false)}
          disabled={isApprovalPending}
        >
          생성 거부
        </TextButton>
        <TextButton
          size="wide"
          variant="filled"
          onClick={() => onApprove(true)}
          disabled={isApprovalPending}
        >
          생성 승인
        </TextButton>
      </div>
    );
  }

  return null;
}
