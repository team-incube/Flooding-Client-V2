export interface Music {
  id: number;
  musicUrl: string;
  appliedAt: string;
  likeCount: number;
  isLiked: boolean;
}

export interface RecommendedMusic extends Music {
  title: string;
  studentNumber: number;
  studentName: string;
  thumbnailUrl: string;
}
