interface FloorLayoutProps {
  floor: string;
  windowLabel?: string;
  children: React.ReactNode;
}

export function FloorLayout({
  floor,
  windowLabel = "창문",
  children,
}: FloorLayoutProps) {
  return (
    <div className="w-[1116px] h-[544px] bg-white rounded-2xl border border-sub-2 overflow-hidden">
      <div className="pt-[12.6px] pb-[13.43px] text-center border-b border-sub-2">
        <span className="text-sub-2 text-[16.82px] font-medium">
          {windowLabel}
        </span>
      </div>
      {children}
      <div className="pt-[26px] pb-[25px] text-center border-t border-sub-2">
        <span className="text-sub-2 text-[16.82px] font-medium">
          {floor} 복도
        </span>
      </div>
    </div>
  );
}
