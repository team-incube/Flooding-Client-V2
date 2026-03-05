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
    <div className="w-[1114px] h-[544px] bg-background-surface rounded-2xl border border-sub-2 overflow-hidden">
      <div className="pt-4 pb-[15px] text-center border-b border-sub-2">
        <span className="text-sub-2 text-text-3 font-medium">
          {windowLabel}
        </span>
      </div>
      {children}
      <div className="py-5 text-center border-t border-sub-2">
        <span className="text-sub-2 text-text-3 font-medium">{floor} 복도</span>
      </div>
    </div>
  );
}
