import type { FloorProps } from "@/features/homebase/model/floor";
import { FloorLayout } from "./FloorLayout";
import { Table } from "./Table";

export function ThirdFloor({ selectedTable, setSelectedTable }: FloorProps) {
  const handleSelect = (table: string) => {
    setSelectedTable(selectedTable === table ? null : table);
  };

  return (
    <FloorLayout floor="3F">
      <div className="grid h-[85px] grid-cols-[1fr_86px_1fr] lg:h-[144px] 2xl:h-[209px]">
        <Table
          name="테이블 1"
          capacity="6명"
          className="border-b border-sub-2"
          selected={selectedTable === "1"}
          onClick={() => handleSelect("1")}
        />
        <div className="flex items-center justify-center border-x border-b border-sub-2">
          <span className="text-text-3 font-medium text-sub-2">칸막이</span>
        </div>
        <Table
          name="테이블 2"
          capacity="6명"
          className="border-b border-sub-2"
          selected={selectedTable === "2"}
          onClick={() => handleSelect("2")}
        />
      </div>

      <div className="grid h-[85px] grid-cols-3 lg:h-[144px] 2xl:h-[209px]">
        <Table
          name="테이블 3"
          capacity="4명"
          className="border-r border-sub-2"
          selected={selectedTable === "3"}
          onClick={() => handleSelect("3")}
        />
        <Table
          name="테이블 5"
          capacity="4명"
          className="border-r border-sub-2"
          selected={selectedTable === "5"}
          onClick={() => handleSelect("5")}
        />
        <Table
          name="테이블 6"
          capacity="4명"
          selected={selectedTable === "6"}
          onClick={() => handleSelect("6")}
        />
      </div>
    </FloorLayout>
  );
}
