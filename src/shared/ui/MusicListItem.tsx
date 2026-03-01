interface MusicListItemProps {
  title: string;
  studentInfo: string;
  time: string;
  thumbnailUrl?: string;
}

export function MusicListItem({
  title,
  studentInfo,
  time,
  thumbnailUrl,
}: MusicListItemProps) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-sub-3 last:border-b-0">
      <div
        className="w-24 shrink-0 rounded-xl bg-sub-4 overflow-hidden"
        style={{ height: "88px" }}
      >
        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="flex flex-1 min-w-0 items-center justify-between">
        <p className="text-main-text font-medium text-[15px] line-clamp-2 flex-1 min-w-0 pr-4">
          {title}
        </p>
        <span className="text-sub-1 text-sm shrink-0 pr-4">{studentInfo}</span>
        <span className="text-sub-2 text-[13px] shrink-0">{time}</span>
      </div>
    </div>
  );
}
