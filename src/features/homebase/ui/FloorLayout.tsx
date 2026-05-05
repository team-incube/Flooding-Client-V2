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
    <div className="border-sub-2 bg-background-surface flex h-69 w-full flex-col overflow-hidden rounded-2xl border lg:h-96.25 2xl:h-136">
      <div className="border-sub-2 shrink-0 border-b pt-4 pb-3.75 text-center">
        <span className="text-text-3 text-sub-2 font-medium">
          {windowLabel}
        </span>
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
      <div className="border-sub-2 flex shrink-0 items-center justify-center border-t py-5">
        <span className="text-text-3 text-sub-2 font-medium">{floor} 복도</span>
      </div>
    </div>
  );
}
