"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";
import { aiMutations } from "@/entities/ai/api/aiMutations";

export interface ChatMessage {
  role: "user" | "ai";
  content: string;
}

const MAX_INPUT_LENGTH = 1000;
const EMPTY_RESPONSE_MESSAGE = "AI 챗봇 응답값이 없습니다.";

function getAiChatErrorMessage(error: unknown) {
  const status = axios.isAxiosError(error) ? error.response?.status : undefined;

  if (status === HttpStatusCode.Unauthorized) {
    return "로그인이 만료되었습니다. 다시 로그인해주세요.";
  }

  if (status === HttpStatusCode.Forbidden) {
    return "AI 챗봇을 사용할 권한이 없습니다.";
  }

  if (status === HttpStatusCode.BadGateway) {
    return "AI 챗봇 서버 응답에 실패했습니다.";
  }

  return "AI 챗봇 응답에 실패했습니다.";
}

export function useAiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  const sendMutation = useMutation({
    ...aiMutations.sendChat(),
    onMutate: (body) => {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: body.user_input },
      ]);
    },
    onSuccess: ({ data }) => {
      const response = data.data?.response?.trim();

      if (!response) {
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: EMPTY_RESPONSE_MESSAGE },
        ]);
        return;
      }

      setMessages((prev) => [...prev, { role: "ai", content: response }]);
    },
    onError: (error) => {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: getAiChatErrorMessage(error) },
      ]);
    },
  });

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || sendMutation.isPending) return;
    sendMutation.mutate({ user_input: trimmed });
    setInput("");
  };

  const handleInputChange = (value: string) => {
    if (value.length <= MAX_INPUT_LENGTH) setInput(value);
  };

  return {
    messages,
    input,
    handleInputChange,
    handleSend,
    isPending: sendMutation.isPending,
  };
}
