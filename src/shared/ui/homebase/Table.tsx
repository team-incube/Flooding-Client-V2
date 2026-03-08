interface TableProps {
  name: string;
  capacity: string;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

export function Table({ name, capacity, className = "", onClick, selected }: TableProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 cursor-pointer
      ${selected ? "bg-p-2" : "bg-background-surface"}
      ${className}`}
    >
      <div className="text-sub-2 text-[18.93px] font-medium">{name}</div>
      <div className="text-p-1 text-[16.82px] font-medium">{capacity}</div>
    </button>
  );
}
