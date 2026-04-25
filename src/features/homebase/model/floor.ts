export interface FloorProps {
  selectedTable: string | null;
  setSelectedTable: (table: string | null) => void;
  reservedTables: Record<string, string[]>;
}
