import { useState } from "react";
import { TextButton } from "@/shared/ui/Button/TextButton";
import { ConfirmModal } from "@/shared/ui/ConfirmModal";

interface ClubActionButtonsProps {
  isEdit: boolean;
  canDelete: boolean;
  onSave: () => void;
  onDelete: () => void;
  changeSummary?: string[];
}

export function ClubActionButtons({
  isEdit,
  canDelete,
  onSave,
  onDelete,
  changeSummary,
}: ClubActionButtonsProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  if (isEdit) {
    return (
      <>
        <div className="flex gap-2">
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
            onClick={() => setIsSaveModalOpen(true)}
          >
            저장
          </TextButton>
        </div>

        <ConfirmModal
          open={isSaveModalOpen}
          title="동아리 수정"
          description={
            changeSummary && changeSummary.length > 0 ? (
              <div className="flex flex-col gap-1">
                <span>다음 내용이 변경됩니다:</span>
                <ul className="flex flex-col gap-0.5 pl-1">
                  {changeSummary.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            ) : (
              "변경사항을 저장하시겠습니까?"
            )
          }
          confirmLabel="저장하기"
          onClose={() => setIsSaveModalOpen(false)}
          onConfirm={() => {
            onSave();
            setIsSaveModalOpen(false);
          }}
        />

        <ConfirmModal
          open={isDeleteModalOpen}
          title="동아리 삭제"
          titleVariant="negative"
          description="동아리를 삭제하시겠습니까?"
          confirmLabel="삭제하기"
          confirmVariant="negative"
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => {
            onDelete();
            setIsDeleteModalOpen(false);
          }}
        />
      </>
    );
  }

  return null;
}
