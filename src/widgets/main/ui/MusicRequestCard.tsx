"use client";

import { useState } from "react";
import Music from "@/shared/asset/svg/Music";
import TextField from "@/shared/ui/textField";
import { TextButton } from "@/shared/ui/Button/TextButton";
import Star from "@/shared/asset/svg/Star";

const mockMusicList = [
  {
    id: 1,
    thumbnail: "/3a6c5821165edd682ddaca9d45502579921fc556.png",
    title:
      "06. 멋진헛간 (Wonderful Barn) – 오대천왕 (The 5 Emperor) (정형돈, 밴드 혁오) (Jeong Hyeong Don, hyukoh)",
    requester: "2403 김민솔",
    time: "14:14",
  },
  {
    id: 2,
    thumbnail: "/3a6c5821165edd682ddaca9d45502579921fc556.png",
    title:
      "06. 멋진헛간 (Wonderful Barn) – 오대천왕 (The 5 Emperor) (정형돈, 밴드 혁오) (Jeong Hyeong Don, hyukoh)",
    requester: "2403 김민솔",
    time: "14:14",
  },
  {
    id: 3,
    thumbnail: "/3a6c5821165edd682ddaca9d45502579921fc556.png",
    title:
      "06. 멋진헛간 (Wonderful Barn) – 오대천왕 (The 5 Emperor) (정형돈, 밴드 혁오) (Jeong Hyeong Don, hyukoh)",
    requester: "2403 김민솔",
    time: "14:14",
  },
  {
    id: 4,
    thumbnail: "/3a6c5821165edd682ddaca9d45502579921fc556.png",
    title:
      "06. 멋진헛간 (Wonderful Barn) – 오대천왕 (The 5 Emperor) (정형돈, 밴드 혁오) (Jeong Hyeong Don, hyukoh)",
    requester: "2403 김민솔",
    time: "14:14",
  },
  {
    id: 5,
    thumbnail: "/3a6c5821165edd682ddaca9d45502579921fc556.png",
    title:
      "06. 멋진헛간 (Wonderful Barn) – 오대천왕 (The 5 Emperor) (정형돈, 밴드 혁오) (Jeong Hyeong Don, hyukoh)",
    requester: "2403 김민솔",
    time: "14:14",
  },
  {
    id: 6,
    thumbnail: "/3a6c5821165edd682ddaca9d45502579921fc556.png",
    title:
      "06. 멋진헛간 (Wonderful Barn) – 오대천왕 (The 5 Emperor) (정형돈, 밴드 혁오) (Jeong Hyeong Don, hyukoh)",
    requester: "2403 김민솔",
    time: "14:14",
  },
  {
    id: 7,
    thumbnail: "/3a6c5821165edd682ddaca9d45502579921fc556.png",
    title:
      "06. 멋진헛간 (Wonderful Barn) – 오대천왕 (The 5 Emperor) (정형돈, 밴드 혁오) (Jeong Hyeong Don, hyukoh)",
    requester: "2403 김민솔",
    time: "14:14",
  },
  {
    id: 8,
    thumbnail: "/3a6c5821165edd682ddaca9d45502579921fc556.png",
    title:
      "06. 멋진헛간 (Wonderful Barn) – 오대천왕 (The 5 Emperor) (정형돈, 밴드 혁오) (Jeong Hyeong Don, hyukoh)",
    requester: "2403 김민솔",
    time: "14:14",
  },
  {
    id: 9,
    thumbnail: "/3a6c5821165edd682ddaca9d45502579921fc556.png",
    title:
      "06. 멋진헛간 (Wonderful Barn) – 오대천왕 (The 5 Emperor) (정형돈, 밴드 혁오) (Jeong Hyeong Don, hyukoh)",
    requester: "2403 김민솔",
    time: "14:14",
  },
  {
    id: 10,
    thumbnail: "/3a6c5821165edd682ddaca9d45502579921fc556.png",
    title:
      "06. 멋진헛간 (Wonderful Barn) – 오대천왕 (The 5 Emperor) (정형돈, 밴드 혁오) (Jeong Hyeong Don, hyukoh)",
    requester: "2403 김민솔",
    time: "14:14",
  },
  {
    id: 11,
    thumbnail: "/3a6c5821165edd682ddaca9d45502579921fc556.png",
    title:
      "06. 멋진헛간 (Wonderful Barn) – 오대천왕 (The 5 Emperor) (정형돈, 밴드 혁오) (Jeong Hyeong Don, hyukoh)",
    requester: "2403 김민솔",
    time: "14:14",
  },
  {
    id: 12,
    thumbnail: "/3a6c5821165edd682ddaca9d45502579921fc556.png",
    title:
      "06. 멋진헛간 (Wonderful Barn) – 오대천왕 (The 5 Emperor) (정형돈, 밴드 혁오) (Jeong Hyeong Don, hyukoh)",
    requester: "2403 김민솔",
    time: "14:14",
  },
];

export default function MusicRequestCard() {
  const [url, setUrl] = useState("");

  return (
    <div className="w-[1518px] h-[520px] bg-background-surface rounded-2xl p-4 min-[1600px]:p-6 flex flex-col mb-6">
      <div className="flex items-center gap-1 mb-4">
        <Music />
        <span className="text-text-1 font-semibold text-main-text">
          기상음악 신청
        </span>
        <span className="text-text-4 text-sub-1 font-medium ml-2">
          신청 음악 <span className="text-p-1">{mockMusicList.length}</span>개
        </span>
      </div>

      <div className="flex gap-6 flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4">
            {mockMusicList.map((item) => (
              <div key={item.id} className="flex items-center">
                <div className="w-[158px] h-[88px] rounded-lg bg-sub-4 flex-shrink-0">
                  <img
                    src={item.thumbnail}
                    alt={`${item.title} 썸네일`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex w-[888px] h-[40px] items-center gap-6 ml-3">
                  <span className="flex-1 text-text-3 text-main-text font-medium">
                    {item.title}
                  </span>
                  <div className="flex items-center gap-6 flex-shrink-0">
                    <span className="text-text-3 text-sub-2 font-medium whitespace-nowrap">
                      {item.requester}
                    </span>
                    <span className="text-text-3 text-sub-2 font-medium whitespace-nowrap mr-6">
                      {item.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-[330px] flex flex-col">
          <span className="text-text-1 font-semibold text-main-text mb-3">
            음악 신청
          </span>

          <div className="flex flex-col gap-3 flex-1">
            <TextField
              placeholder="URL을 입력해주세요"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <TextButton
              variant={url.trim() ? "filled" : "disabled"}
              size="wide"
            >
              신청하기
            </TextButton>
          </div>

          <div className="flex justify-end">
            <button className="w-13 h-13 rounded-full bg-p-2 flex items-center justify-center">
              <Star />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
