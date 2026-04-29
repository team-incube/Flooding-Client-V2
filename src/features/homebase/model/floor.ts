export interface FloorProps {
  selectedTable: string | null;
  onTableSelect: (table: string) => void;
  reservedTables: Record<string, string[]>;
}
