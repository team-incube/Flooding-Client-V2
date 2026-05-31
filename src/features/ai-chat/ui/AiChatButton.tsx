"use client";

import { useState } from "react";
import Chatbot from "@/shared/asset/svg/Chatbot";

interface AiChatButtonProps {
  onClick: () => void;
}

export function AiChatButton({ onClick }: AiChatButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      className="fixed right-6 bottom-6 z-40 flex size-13 cursor-pointer items-center justify-center overflow-hidden rounded-full border-0 bg-transparent p-0 shadow-[0_4px_16px_rgba(0,0,0,0.16)]"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div className="pointer-events-none absolute right-0 bottom-full mb-4">
          <div className="bg-background-surface text-sub-1 relative rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap shadow-[0_0_24px_rgba(0,0,0,0.1)]">
            AI 챗봇에게 무엇이든 물어보세요!
            <div className="bg-background-surface absolute right-[22px] -bottom-1.5 size-3 rotate-45" />
          </div>
        </div>
      )}
      <Chatbot />
    </button>
  );
}
