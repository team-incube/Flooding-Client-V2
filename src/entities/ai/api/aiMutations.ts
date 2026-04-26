import { instance } from "@/shared/api/instance";
import type {
  RecommendAiSongRequest,
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
  recommendSong: (body: RecommendAiSongRequest) =>
    instance.post<CommonResponse<RecommendAiSongResponse>>("/ai/song", body),

  sendChat: (body: SendAiChatRequest) =>
    instance.post<CommonResponse<SendAiChatResponse>>("/ai/chat", body),
};
