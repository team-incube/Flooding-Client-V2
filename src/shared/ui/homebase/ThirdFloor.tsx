export function ThirdFloor() {
  return (
    <div className="w-[1116px] h-[544px] bg-white rounded-2xl border border-sub-2 overflow-hidden">
      <div className="pt-[12.6px] pb-[13.43px] text-center border-b border-sub-2">
        <span className="text-sub-2 text-[16.82px] font-medium">창문</span>
      </div>

      <div className="grid grid-cols-[1fr_80px_1fr] h-[209px]">
        <button className="flex flex-col items-center justify-center gap-1 border-b border-sub-2 cursor-pointer">
          <div className="text-sub-2 text-[18.93px] font-medium">테이블 1</div>
          <div className="text-p-1 text-[16.82px] font-medium">6명</div>
        </button>

        <div className="flex items-center justify-center border-x border-b border-sub-2">
          <span className="text-sub-2 text-[16.82px] font-medium">칸막이</span>
        </div>

        <button className="flex flex-col items-center justify-center gap-1 border-b border-sub-2 cursor-pointer">
          <div className="text-sub-2 text-[18.93px] font-medium">테이블 2</div>
          <div className="text-p-1 text-[16.82px] font-medium">6명</div>
        </button>
      </div>

      <div className="flex h-[209px]">
        <button className="flex-1 flex flex-col items-center justify-center gap-1 border-r border-sub-2 cursor-pointer">
          <div className="text-sub-2 text-[18.93px] font-medium">테이블 3</div>
          <div className="text-p-1 text-[16.82px] font-medium">4명</div>
        </button>

        <button className="flex-1 flex flex-col items-center justify-center gap-1 border-r border-sub-2 cursor-pointer">
          <div className="text-sub-2 text-[18.93px] font-medium">테이블 4</div>
          <div className="text-p-1 text-[16.82px] font-medium">4명</div>
        </button>

        <button className="flex-1 flex flex-col items-center justify-center gap-1 cursor-pointer">
          <div className="text-sub-2 text-[18.93px] font-medium">테이블 5</div>
          <div className="text-p-1 text-[16.82px] font-medium">4명</div>
        </button>
      </div>

      <div className="pt-[26px] pb-[25px] text-center border-t border-sub-2">
        <span className="text-sub-2 text-[16.82px] font-medium">3F 복도</span>
      </div>
    </div>
  );
}
