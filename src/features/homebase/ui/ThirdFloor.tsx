import type { FloorProps } from "@/features/homebase/model/floor";
import { FloorLayout } from "./FloorLayout";
import { Table } from "./Table";

export function ThirdFloor({
  selectedTable,
  onTableSelect,
  reservedTables,
}: FloorProps) {
  return (
    <FloorLayout floor="3F">
      <div className="grid h-21.25 grid-cols-[1fr_86px_1fr] lg:h-36 2xl:h-52.25">
        <Table
          name="테이블 1"
          capacity="6명"
          className="border-b border-sub-2"
          selected={selectedTable === "1"}
          reserved={!!reservedTables["1"]}
          members={reservedTables["1"] ?? []}
          onClick={() => onTableSelect("1")}
        />
        <div className="flex items-center justify-center border-x border-b border-sub-2">
          <span className="text-text-3 font-medium text-sub-2">칸막이</span>
        </div>
        <Table
          name="테이블 2"
          capacity="6명"
          className="border-b border-sub-2"
          selected={selectedTable === "2"}
          reserved={!!reservedTables["2"]}
          members={reservedTables["2"] ?? []}
          onClick={() => onTableSelect("2")}
        />
      </div>

      <div className="grid flex-1 grid-cols-3">
        <Table
          name="테이블 3"
          capacity="4명"
          className="border-r border-sub-2"
          selected={selectedTable === "3"}
          reserved={!!reservedTables["3"]}
          members={reservedTables["3"] ?? []}
          onClick={() => onTableSelect("3")}
        />
        <Table
          name="테이블 5"
          capacity="4명"
          className="border-r border-sub-2"
          selected={selectedTable === "5"}
          reserved={!!reservedTables["5"]}
          members={reservedTables["5"] ?? []}
          onClick={() => onTableSelect("5")}
        />
        <Table
          name="테이블 6"
          capacity="4명"
          selected={selectedTable === "6"}
          reserved={!!reservedTables["6"]}
          members={reservedTables["6"] ?? []}
          onClick={() => onTableSelect("6")}
        />
      </div>
    </FloorLayout>
  );
}
