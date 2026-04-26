export interface SongRequest {
  title: string;
  artist: string;
}

export interface RecommendAiSongRequest {
  recent_songs: SongRequest[];
}

export interface RecommendAiSongResponse {
  youtube_links: string[];
}

export interface SendAiChatRequest {
  user_input: string;
}

export interface SendAiChatResponse {
  response: string;
}
