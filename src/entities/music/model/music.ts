export interface Music {
  id: number;
  musicUrl: string;
  appliedAt: string;
  likeCount: number;
  isLiked?: boolean;
  title?: string;
  studentNumber?: number;
  studentName?: string;
  thumbnailUrl?: string;
}
