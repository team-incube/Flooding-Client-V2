"use client";

import { useState } from "react";
import { AiChatModal } from "@/features/ai-chat/ui/AiChatModal";
import Chatbot from "@/shared/asset/svg/Chatbot";

export function AiChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <button
        className="fixed bottom-6 right-6 w-13 h-13 rounded-full bg-p-1 flex items-center justify-center cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.16)] z-40"
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered && (
          <div className="absolute bottom-full mb-4 right-0 pointer-events-none">
            <div className="relative bg-background-surface text-sub-1 px-4 py-2 rounded-lg shadow-[0_0_24px_rgba(0,0,0,0.1)] whitespace-nowrap text-sm font-medium">
              AI 챗봇에게 무엇이든 물어보세요!
              <div className="absolute -bottom-1.5 right-[22px] w-3 h-3 bg-background-surface rotate-45" />
            </div>
          </div>
        )}
        <Chatbot />
      </button>
      <AiChatModal open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
