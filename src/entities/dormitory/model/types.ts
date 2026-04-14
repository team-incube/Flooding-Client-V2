import type { User } from '@/entities/user/model/user';
import type { Music } from '@/entities/music/model/music';

export type DormitoryStudent = User;
export type DormitoryMusic = Music;

export interface MusicApplyRequest {
  url: string;
}
