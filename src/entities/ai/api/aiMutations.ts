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

export const aiMutations = {
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
