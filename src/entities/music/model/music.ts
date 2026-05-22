export interface Music {
  id: number;
  musicUrl: string;
  appliedAt: string;
  likeCount: number;
  isLiked: boolean;
  title?: string | null;
  artist?: string | null;
  duration?: string | null;
  durationText?: string | null;
  thumbnailUrl?: string | null;
  videoUrl?: string | null;
}

export interface RecommendedMusic extends Music {
  title: string;
  studentNumber: number;
  studentName: string;
  thumbnailUrl: string;
}
