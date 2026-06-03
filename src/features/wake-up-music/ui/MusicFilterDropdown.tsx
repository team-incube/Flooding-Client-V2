import { useState, useRef, useEffect } from "react";
import type { FilterType } from "@/features/wake-up-music/model/useMusicFilter";

interface MusicFilterDropdownProps {
  onFilterChange: (
    filterType: FilterType,
    filterValue: string | number,
  ) => void;
  onClear: () => void;
  currentFilter: FilterType;
  currentFilterLabel: string;
}

export function MusicFilterDropdown({
  onFilterChange,
  onClear,
  currentFilter,
  currentFilterLabel,
}: MusicFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filterOptions = [
    { label: "시간순 (오래된 순)", value: "time-asc", type: "time" as const },
    { label: "시간순 (최근 순)", value: "time-desc", type: "time" as const },
    { label: "1학년", value: "grade-1", type: "grade" as const },
    { label: "2학년", value: "grade-2", type: "grade" as const },
    { label: "3학년", value: "grade-3", type: "grade" as const },
    { label: "이름 오름차순", value: "name-asc", type: "name" as const },
    { label: "이름 내림차순", value: "name-desc", type: "name" as const },
  ];

  const handleSelectFilter = (option: (typeof filterOptions)[0]) => {
    let filterValue: string | number = "";

    if (option.type === "time") {
      filterValue = option.value.split("-")[1];
    } else if (option.type === "grade") {
      filterValue = Number(option.value.split("-")[1]);
    } else if (option.type === "name") {
      filterValue = option.value.split("-")[1];
    }

    onFilterChange(option.type, filterValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`text-caption-1 flex cursor-pointer items-center gap-1 rounded px-2 py-1 transition-colors ${
          currentFilter === "none"
            ? "text-sub-2 hover:bg-surface"
            : "text-sub-4"
        }`}
      >
        <span>{currentFilter === "none" ? "필터링" : currentFilterLabel}</span>
        <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="bg-background-surface border-sub-3 absolute top-full right-0 z-50 mt-2 min-w-40 rounded-lg border shadow-lg">
          <div className="py-2">
            <button
              onClick={onClear}
              className="text-sub-1 hover:bg-surface text-caption-1 w-full cursor-pointer px-4 py-2 text-left transition-colors"
            >
              필터 초기화
            </button>
            <div className="border-sub-4 my-1 border-t" />
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelectFilter(option)}
                className="text-main-text hover:bg-surface text-caption-1 w-full cursor-pointer px-4 py-2 text-left transition-colors"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
