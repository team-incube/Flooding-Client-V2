import type { FloorProps } from "@/features/homebase/model/floor";
import { FloorLayout } from "./FloorLayout";
import { Table } from "./Table";

export function SecondFloor({
  selectedTable,
  onTableSelect,
  reservedTables,
}: FloorProps) {
  return (
    <FloorLayout floor="2F">
      <div className="grid h-21.25 grid-cols-[1fr_86px_1fr] lg:h-36 2xl:h-52.25">
        <Table
          name="테이블 1"
          capacity="6명"
          className="border-sub-2 border-b"
          selected={selectedTable === "1"}
          reserved={!!reservedTables["1"]}
          members={reservedTables["1"] ?? []}
          onClick={() => onTableSelect("1")}
        />
        <div className="border-sub-2 flex items-center justify-center border-x border-b">
          <span className="text-text-3 text-sub-2 font-medium">칸막이</span>
        </div>
        <Table
          name="테이블 2"
          capacity="4명"
          className="border-sub-2 border-b"
          selected={selectedTable === "2"}
          reserved={!!reservedTables["2"]}
          members={reservedTables["2"] ?? []}
          onClick={() => onTableSelect("2")}
        />
      </div>

      <div className="grid flex-1 grid-cols-[1fr_86px_1fr]">
        <Table
          name="테이블 3"
          capacity="4명"
          className="border-sub-2 border-r"
          selected={selectedTable === "3"}
          reserved={!!reservedTables["3"]}
          members={reservedTables["3"] ?? []}
          onClick={() => onTableSelect("3")}
        />
      </div>
    </FloorLayout>
  );
}
