export interface Reservation {
  id: number;
  tableName: string;
  floor: string;
  members: string[];
  periods: string[];
  reason: string;
}
