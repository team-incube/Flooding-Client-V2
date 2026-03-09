interface TableProps {
  name: string;
  capacity: string;
  className?: string;
  onClick?: () => void;
}

export function Table({ name, capacity, className = "", onClick }: TableProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 cursor-pointer ${className}`}
    >
      <div className="text-sub-2 text-text-1 font-medium">{name}</div>
      <div className="text-p-1 text-text-3 font-medium">{capacity}</div>
    </button>
  );
}
