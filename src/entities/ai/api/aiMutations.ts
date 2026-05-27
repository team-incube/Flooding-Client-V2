import { mutationOptions } from "@tanstack/react-query";
import { instance, LONG_API_TIMEOUT_MS } from "@/shared/api/instance";
import type {
  RecommendAiSongResponse,
  SendAiChatRequest,
  SendAiChatResponse,
} from "@/entities/ai/model/ai";

interface CommonResponse<T> {
  status: string;
  code: number;
  message: string;
  data?: T;
}

const requests = {
  recommendSong: () =>
    instance.post<CommonResponse<RecommendAiSongResponse>>(
      "/ai/song",
      undefined,
      {
        timeout: LONG_API_TIMEOUT_MS,
      },
    ),

  sendChat: (body: SendAiChatRequest) =>
    instance.post<CommonResponse<SendAiChatResponse>>("/ai/chat", body, {
      timeout: LONG_API_TIMEOUT_MS,
    }),
};

export const aiMutations = {
  recommendSong: () =>
    mutationOptions({
      mutationKey: ["ai", "song-recommend"],
      mutationFn: requests.recommendSong,
    }),

  sendChat: () =>
    mutationOptions({
      mutationKey: ["ai", "chat-send"],
      mutationFn: requests.sendChat,
    }),
};

export { requests as aiRequests };
