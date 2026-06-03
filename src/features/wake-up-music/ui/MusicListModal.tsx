"use client";

import { MusicListItem } from "@/entities/music/ui/MusicListItem";
import type { DormitoryMusic } from "@/entities/dormitory/model/dormitory";

interface MusicListModalProps {
  isOpen: boolean;
  songs: DormitoryMusic[];
  meId?: number | null;
  onClose: () => void;
  onToggleLike: (music: DormitoryMusic) => void;
  onDelete: (musicId: number) => void;
  likeMutation: {
    isPending: boolean;
    variables?: { id: number } | null;
  };
  cancelMutation: {
    isPending: boolean;
    variables?: string | number | null;
  };
}

export function MusicListModal({
  isOpen,
  songs,
  meId,
  onClose,
  onToggleLike,
  onDelete,
  likeMutation,
  cancelMutation,
}: MusicListModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="bg-background/50 fixed inset-0 z-50 flex cursor-default items-center justify-center overflow-y-auto px-5 py-10"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-background-surface mx-auto flex max-h-[calc(100vh-120px)] w-full max-w-[1400px] flex-col gap-6 overflow-hidden rounded-3xl p-8 shadow-[0_16px_80px_rgba(0,0,0,0.18)] sm:my-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-main-text text-text-1 font-semibold">
              기상음악 신청 목록
            </span>
            <div className="text-sub-1 text-caption-1 mt-1">
              현재 {songs.length}개의 신청 곡을 한꺼번에 확인할 수 있습니다.
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-sub-1 text-caption-2 hover:text-p-1 cursor-pointer transition-colors"
          >
            닫기
          </button>
        </div>

        <div className="border-sub-4 bg-background flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border p-6 shadow-inner">
          {songs.length === 0 ? (
            <div className="text-sub-1 text-caption-1 py-16 text-center">
              신청된 음악이 없습니다.
            </div>
          ) : (
            <div className="min-h-0 overflow-y-auto">
              {songs.map((music) => (
                <MusicListItem
                  key={music.id}
                  music={music}
                  isLikePending={
                    likeMutation.isPending &&
                    likeMutation.variables?.id === music.id
                  }
                  onToggleLike={() => onToggleLike(music)}
                  onDelete={
                    meId && meId === music.userId
                      ? () => onDelete(music.id)
                      : undefined
                  }
                  isDeletePending={
                    cancelMutation.isPending &&
                    cancelMutation.variables === music.id
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
