import { useState, useRef, useEffect } from "react";
import type {
  FilterType,
  MusicFilterState,
} from "@/features/wake-up-music/model/useMusicFilter";

interface MusicFilterDropdownProps {
  onFilterChange: (
    filterType: FilterType,
    filterValue: string | number,
  ) => void;
  onClear: () => void;
  currentFilterLabel: string;
  hasFilter: boolean;
  filterState: MusicFilterState;
}

export function MusicFilterDropdown({
  onFilterChange,
  onClear,
  currentFilterLabel,
  hasFilter,
  filterState,
}: MusicFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    { label: "이름순", value: "name", type: "name" as const },
    { label: "1학년", value: "grade-1", type: "grade" as const },
    { label: "2학년", value: "grade-2", type: "grade" as const },
    { label: "3학년", value: "grade-3", type: "grade" as const },
  ];

  const isOptionActive = (option: (typeof filterOptions)[0]) => {
    if (option.type === "time") {
      const order = option.value.split("-")[1] as "asc" | "desc";
      return filterState.timeOrder === order;
    }
    if (option.type === "name") {
      return !!filterState.nameOrder;
    }
    if (option.type === "grade") {
      const grade = Number(option.value.split("-")[1]);
      return filterState.grade === grade;
    }
    return false;
  };

  const handleSelectFilter = (option: (typeof filterOptions)[0]) => {
    let filterValue: string | number = "";

    if (option.type === "time") {
      filterValue = option.value.split("-")[1];
    } else if (option.type === "grade") {
      filterValue = Number(option.value.split("-")[1]);
    } else if (option.type === "name") {
      filterValue = "asc";
    }

    onFilterChange(option.type, filterValue);
    // 다중 선택을 위해 드롭다운 닫지 않음
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`text-caption-1 flex cursor-pointer items-center gap-1 rounded px-2 py-1 transition-colors ${
          hasFilter ? "text-p-1" : "text-sub-2 hover:bg-surface"
        }`}
      >
        <span>{currentFilterLabel}</span>
        <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="bg-background-surface border-sub-3 absolute top-full right-0 z-50 mt-2 min-w-44 rounded-lg border shadow-lg">
          <div className="py-2">
            <button
              onClick={() => {
                onClear();
                setIsOpen(false);
              }}
              className="text-sub-1 hover:bg-surface text-caption-1 w-full cursor-pointer px-4 py-2 text-left transition-colors"
            >
              필터 초기화
            </button>
            <div className="border-sub-4 my-1 border-t" />
            {filterOptions.map((option) => {
              const active = isOptionActive(option);
              return (
                <button
                  key={option.value}
                  onClick={() => handleSelectFilter(option)}
                  className={`text-caption-1 w-full cursor-pointer px-4 py-2 text-left transition-colors ${
                    active
                      ? "text-p-1 bg-surface font-medium"
                      : "text-main-text hover:bg-surface"
                  }`}
                >
                  <span className="flex items-center justify-between gap-4">
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
