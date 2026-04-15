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
    <div className="flex h-[276px] w-full flex-col overflow-hidden rounded-2xl border border-sub-2 bg-background-surface lg:h-[385px] 2xl:h-[544px]">
      <div className="shrink-0 border-b border-sub-2 pt-4 pb-[15px] text-center">
        <span className="text-text-3 font-medium text-sub-2">
          {windowLabel}
        </span>
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
      <div className="flex shrink-0 items-center justify-center border-t border-sub-2 py-5">
        <span className="text-text-3 font-medium text-sub-2">{floor} 복도</span>
      </div>
    </div>
  );
}
