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
    <div className="w-full h-[276px] lg:h-[385px] 2xl:h-[544px] bg-background-surface rounded-2xl border border-sub-2 overflow-hidden flex flex-col">
      <div className="pt-4 pb-[15px] text-center border-b border-sub-2 shrink-0">
        <span className="text-sub-2 text-text-3 font-medium">
          {windowLabel}
        </span>
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
      <div className="flex items-center justify-center border-t border-sub-2 shrink-0 py-5">
        <span className="text-sub-2 text-text-3 font-medium">{floor} 복도</span>
      </div>
    </div>
  );
}
