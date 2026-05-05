interface TableProps {
  name: string;
  capacity: string;
  className?: string;
  onClick?: () => void;
  reserved?: boolean;
  selected?: boolean;
  members?: string[];
}

export function Table({
  name,
  capacity,
  className = "",
  onClick,
  reserved = false,
  selected = false,
  members = [],
}: TableProps) {
  const bgClass = reserved
    ? "bg-sub-4"
    : selected
      ? "bg-p-2"
      : "bg-background-surface";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 px-4 focus:outline-none ${reserved ? "cursor-not-allowed" : "cursor-pointer"} ${bgClass} ${className}`}
    >
      {reserved ? (
        <div className="flex flex-col items-center gap-1">
          <span className="text-text-1 text-sub-1 font-medium">{name}</span>
          <span className="text-text-3 text-sub-2 text-center">
            {members.join(", ")}
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1">
          <div className="text-sub-2 text-[18.93px] font-medium">{name}</div>
          <div className="text-p-1 text-[16.82px] font-medium">{capacity}</div>
        </div>
      )}
    </button>
  );
}
