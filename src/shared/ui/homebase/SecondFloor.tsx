import type { Reservation } from "@/entities/school/model/reservation";
import { FloorLayout } from "./FloorLayout";
import { Table } from "./Table";
import { getRes } from "./floorUtils";

interface SecondFloorProps {
  reservations?: Reservation[];
  selectedTable?: string;
  onTableSelect?: (name: string) => void;
}

export function SecondFloor({ reservations = [], selectedTable, onTableSelect }: SecondFloorProps) {
  return (
    <FloorLayout floor="2F">
      <div className="grid grid-cols-[1fr_80px_1fr] h-[209px]">
        <Table
          name="테이블 1"
          capacity="6명"
          className="border-b border-sub-2"
          reserved={!!getRes(reservations, "테이블 1")}
          members={getRes(reservations, "테이블 1")?.members}
          selected={selectedTable === "테이블 1"}
          onClick={() => onTableSelect?.("테이블 1")}
        />
        <div className="flex items-center justify-center border-x border-b border-sub-2">
          <span className="text-sub-2 text-[16.82px] font-medium">칸막이</span>
        </div>
        <Table
          name="테이블 2"
          capacity="4명"
          className="border-b border-sub-2"
          reserved={!!getRes(reservations, "테이블 2")}
          members={getRes(reservations, "테이블 2")?.members}
          selected={selectedTable === "테이블 2"}
          onClick={() => onTableSelect?.("테이블 2")}
        />
      </div>

      <div className="grid grid-cols-[1fr_80px_1fr] h-[209px]">
        <Table
          name="테이블 3"
          capacity="4명"
          className="border-r border-sub-2"
          reserved={!!getRes(reservations, "테이블 3")}
          members={getRes(reservations, "테이블 3")?.members}
          selected={selectedTable === "테이블 3"}
          onClick={() => onTableSelect?.("테이블 3")}
        />
      </div>
    </FloorLayout>
  );
}
