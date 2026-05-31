"use client";

import { useEffect, useRef } from "react";
import Back from "@/shared/asset/svg/Back";
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
    <div
      className="absolute inset-0 z-50 sm:fixed sm:flex sm:items-end sm:justify-end sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-background-surface flex size-full flex-col sm:h-[560px] sm:w-[400px] sm:rounded-2xl sm:shadow-[0_0_24px_rgba(0,0,0,0.12)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-sub-4 flex items-center gap-1 px-5 py-4 sm:justify-between sm:border-b">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer sm:hidden"
            aria-label="닫기"
          >
            <Back direction="left" />
          </button>
          <div className="flex items-center gap-1">
            <span className="hidden sm:flex">
              <SmallStar />
            </span>
            <span className="text-main-text text-text-2">AI 챗봇</span>
          </div>
          <button
            onClick={onClose}
            className="hidden cursor-pointer sm:block"
            aria-label="닫기"
          >
            <Cancel />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-2">
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
                className={`text-caption-1 max-w-[75%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-p-1 rounded-br-sm text-white"
                    : "bg-sub-4 text-main-text rounded-bl-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isPending && (
            <div className="flex justify-start">
              <div className="bg-sub-4 rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex items-center gap-1">
                  <span className="bg-sub-2 size-1.5 animate-bounce rounded-full [animation-delay:0ms]" />
                  <span className="bg-sub-2 size-1.5 animate-bounce rounded-full [animation-delay:150ms]" />
                  <span className="bg-sub-2 size-1.5 animate-bounce rounded-full [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-sub-4 flex items-center justify-center gap-2 px-4 py-3 sm:border-t">
          <textarea
            ref={textareaRef}
            className="border-sub-2 bg-background-surface text-main-text placeholder:text-sub-2 focus:border-sub-1 text-caption-1 caret-p-1 flex-1 resize-none rounded-[8px] border px-4 py-3 outline-none"
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
            className="bg-p-1 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          >
            <SendArrow />
          </button>
        </div>
      </div>
    </div>
  );
}
