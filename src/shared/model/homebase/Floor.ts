export interface FloorProps {
  selectedTable: string | null;
  setSelectedTable: (table: string | null, max?: number) => void;
}