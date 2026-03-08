import { FloorLayout } from "./FloorLayout";
import { Table } from "./Table";
import { FloorProps } from "@/shared/model/homebase/Floor";

export function FourthFloor({ selectedTable, setSelectedTable }: FloorProps) {
  const handleSelect = (table: string) => {
    setSelectedTable(selectedTable === table ? null : table);
  };
  return (
    <FloorLayout floor="4F">
      <div className="grid grid-cols-[1fr_80px_1fr] h-[209px]">
        <Table
          name="테이블 1"
          capacity="6명"
          className="border-b border-sub-2"
          onClick={() => handleSelect("1")}
          selected={selectedTable === "1"}
        />
        <div className="flex items-center justify-center border-x border-b border-sub-2">
          <span className="text-sub-2 text-[16.82px] font-medium">칸막이</span>
        </div>
        <Table
          name="테이블 2"
          capacity="6명"
          className="border-b border-sub-2"
          onClick={() => handleSelect("2")}
          selected={selectedTable === "2"}
        />
      </div>

      <div className="flex h-[209px]">
        <Table
          name="테이블 3"
          capacity="4명"
          className="flex-1 border-r border-sub-2"
          onClick={() => handleSelect("3")}
          selected={selectedTable === "3"}
        />
        <Table
          name="테이블 4"
          capacity="4명"
          className="flex-1"
          onClick={() => handleSelect("4")}
          selected={selectedTable === "4"}
        />
      </div>
    </FloorLayout>
  );
}
