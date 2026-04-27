"use client";

import { useEffect, useRef } from "react";
import Cancel from "@/shared/asset/svg/Cancel";
import SendArrow from "@/shared/asset/svg/SendArrow";
import SmallStar from "@/shared/asset/svg/SmallStar";
import { useAiChat } from "@/features/ai-chat/model/useAiChat";

interface AiChatModalProps {
  open: boolean;
  onClose: () => void;
}

const MAX_TEXTAREA_ROWS = 4;
const LINE_HEIGHT_FALLBACK_RATIO = 1.2;

function getTextareaLineHeight(computedStyle: CSSStyleDeclaration) {
  const lineHeight = Number.parseFloat(computedStyle.lineHeight);
  if (Number.isFinite(lineHeight)) return lineHeight;

  const fontSize = Number.parseFloat(computedStyle.fontSize);
  return fontSize * LINE_HEIGHT_FALLBACK_RATIO;
}

function resizeTextareaToContent(textarea: HTMLTextAreaElement) {
  textarea.style.height = "auto";

  const computedStyle = window.getComputedStyle(textarea);
  const paddingTop = Number.parseFloat(computedStyle.paddingTop) || 0;
  const paddingBottom = Number.parseFloat(computedStyle.paddingBottom) || 0;
  const maxHeight =
    getTextareaLineHeight(computedStyle) * MAX_TEXTAREA_ROWS +
    paddingTop +
    paddingBottom;

  textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  textarea.style.overflowY =
    textarea.scrollHeight > maxHeight ? "auto" : "hidden";
}

export function AiChatModal({ open, onClose }: AiChatModalProps) {
  const { messages, input, handleInputChange, handleSend, isPending } =
    useAiChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!textareaRef.current) return;
    resizeTextareaToContent(textareaRef.current);
  }, [input, open]);

  if (!open) return null;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 flex items-end justify-end p-6 z-50 pointer-events-none">
      <div className="flex flex-col bg-background-surface rounded-2xl shadow-[0_0_24px_rgba(0,0,0,0.12)] w-[400px] h-[560px] pointer-events-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-sub-4">
          <div className="flex items-center gap-1">
            <SmallStar />
            <span className="text-main-text text-text-2">AI 챗봇</span>
          </div>
          <button onClick={onClose} className="cursor-pointer">
            <Cancel />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <SmallStar />
              <p className="text-sub-2 text-caption-1 text-center">
                무엇이든 물어보세요!
              </p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl text-caption-1 ${
                  msg.role === "user"
                    ? "bg-p-1 text-white rounded-br-sm"
                    : "bg-sub-4 text-main-text rounded-bl-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isPending && (
            <div className="flex justify-start">
              <div className="bg-sub-4 px-4 py-3 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-sub-2 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-sub-2 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-sub-2 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="px-4 py-3 border-t border-sub-4 flex gap-2 justify-center items-end">
          <textarea
            ref={textareaRef}
            className="flex-1 resize-none rounded-[8px] border border-sub-2 bg-background-surface text-main-text placeholder:text-sub-2 focus:border-sub-1 outline-none px-4 py-3 text-caption-1 caret-p-1 transition-colors"
            rows={1}
            placeholder="메시지를 입력하세요"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isPending}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isPending}
            className="shrink-0 w-9 h-9 rounded-full bg-p-1 flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            <SendArrow />
          </button>
        </div>
      </div>
    </div>
  );
}
