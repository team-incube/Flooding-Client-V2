export interface RecommendAiSongResponse {
  youtube_links: string[];
}

export interface SendAiChatRequest {
  user_input: string;
}

export interface SendAiChatResponse {
  response: string;
}
