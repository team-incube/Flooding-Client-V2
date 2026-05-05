import { useState } from "react";
import { TextButton } from "@/shared/ui/Button/TextButton";

interface ClubActionButtonsProps {
  isEdit: boolean;
  canDelete: boolean;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

export function ClubActionButtons({
  isEdit,
  canDelete,
  onSave,
  onCancel,
  onDelete,
}: ClubActionButtonsProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (isEdit) {
    return (
      <>
        <div className={`flex gap-2 ${canDelete ? "w-[350px]" : "w-[240px]"}`}>
          <TextButton
            size="fit"
            variant="ghost"
            className="min-w-[118px] flex-1"
            onClick={onCancel}
          >
            돌아가기
          </TextButton>
          {canDelete && (
            <TextButton
              size="fit"
              variant="negative"
              className="min-w-[118px] flex-1"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              동아리 삭제
            </TextButton>
          )}
          <TextButton
            size="fit"
            variant="filled"
            className="min-w-[118px] flex-1"
            onClick={onSave}
          >
            저장
          </TextButton>
        </div>

        {isDeleteModalOpen && (
          <div className="bg-background/50 fixed inset-0 z-[100] flex items-center justify-center">
            <div className="bg-background-surface text-text-1 flex w-[90%] max-w-[448px] flex-col gap-3 rounded-2xl p-6">
              <span className="text-negative font-bold">동아리 삭제</span>
              <span className="text-main-text">동아리를 삭제하시겠습니까?</span>
              <div className="flex gap-2">
                <TextButton
                  size="fit"
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  뒤로가기
                </TextButton>
                <TextButton
                  size="fit"
                  variant="negative"
                  className="flex-1"
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

  return null;
}
