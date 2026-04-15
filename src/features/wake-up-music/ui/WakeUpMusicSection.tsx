"use client";

import { ReactNode, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Music from "@/shared/asset/svg/Music";
import { MusicListItem } from "@/entities/music/ui/MusicListItem";
import { Calendar } from "@/shared/ui/Calendar";
import { TextButton } from "@/shared/ui/Button/TextButton";
import TextField from "@/shared/ui/textField";
import {
  dormitoryQueries,
  dormitoryMutations,
} from "@/entities/dormitory/api/dormitory.queries";
import { MusicRecommendModal } from "./MusicRecommendModal";

interface WakeUpMusicSectionProps {
  icon?: ReactNode;
  className?: string;
}

export function WakeUpMusicSection({
  icon,
  className,
}: WakeUpMusicSectionProps) {
  const queryClient = useQueryClient();
  const [urlInput, setUrlInput] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { data: songs = [] } = useQuery(dormitoryQueries.music());

  const applyMutation = useMutation({
    mutationFn: () => dormitoryMutations.applyMusic({ url: urlInput }),
    onSuccess: () => {
      setUrlInput("");
      queryClient.invalidateQueries({ queryKey: ["dormitory", "music"] });
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered , setIsHovered] = useState(false);

  return (
    <section
      className={`relative bg-background-surface rounded-2xl p-6 flex flex-col gap-6 h-[424px] 2xl:h-[520px] ${className ?? ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-end gap-3">
        <div className="flex items-center gap-2">
          <Music />
          <span className="text-main-text text-text-1">기상음악 신청</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sub-1 text-caption-1">신청 음악</span>
          <span className="text-p-1 text-caption-1">{songs.length}개</span>
        </div>
      </div>

      <div className="flex gap-6 flex-1 overflow-hidden">
        <div className="flex-1 min-w-0 overflow-y-auto pr-2">
          <div className="flex flex-col">
            {songs.map((music) => (
              <MusicListItem key={music.id} music={music} />
            ))}
          </div>
        </div>

        <div className="w-[240px] lg:w-[330px] shrink-0 flex flex-col gap-20">
          <div className="flex flex-col gap-3">
            <span className="text-main-text text-text-2">음악 신청</span>
            <TextField
              placeholder="URL을 입력해주세요"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
            <TextButton
              variant="filled"
              size="wide"
              className="w-full"
              onClick={() => applyMutation.mutate()}
            >
              신청하기
            </TextButton>
          </div>

          {!icon && (
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          )}
        </div>
      </div>

      {icon && (
          <button
            className="absolute bottom-6 right-6 w-13 h-13 rounded-full bg-p-2 flex items-center justify-center cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            {isHovered && (
              <div className="absolute bottom-full mb-4 right-0 pointer-events-none">
                <div className="relative bg-surface text-sub-1 px-4 py-2 rounded-lg shadow-[0_0_24px_rgba(0,0,0,0.1)] whitespace-nowrap text-sm font-medium">
                  오늘의 노래를 <span className="text-p-1">ai</span>한테 추천 받아봐요!
                  <div className="absolute -bottom-1.5 right-[22px] w-3 h-3 bg-background-surface rotate-45"></div>
                </div>
              </div>
            )}
            {icon}
          </button>
      )}
      <MusicRecommendModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
