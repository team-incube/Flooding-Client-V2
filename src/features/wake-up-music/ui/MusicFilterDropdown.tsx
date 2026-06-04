import { useState, useRef, useEffect } from "react";
import type { WakeUpMusicSort } from "@/features/wake-up-music/model/useMusicFilter";

interface MusicFilterDropdownProps {
  sort: WakeUpMusicSort;
  onSortChange: (sort: WakeUpMusicSort) => void;
  currentFilterLabel: string;
  hasFilter: boolean;
}

const SORT_OPTIONS: { label: string; value: WakeUpMusicSort }[] = [
  { label: "시간순", value: "TIME" },
  { label: "좋아요순", value: "LIKE" },
];

export function MusicFilterDropdown({
  sort,
  onSortChange,
  currentFilterLabel,
  hasFilter,
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

  const handleSelect = (value: WakeUpMusicSort) => {
    onSortChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`text-caption-1 flex cursor-pointer items-center gap-1 rounded px-2 py-1 transition-colors ${
          hasFilter ? "bg-p-1 text-sub-4" : "text-sub-2 hover:bg-surface"
        }`}
      >
        <span>{currentFilterLabel}</span>
        <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="bg-background-surface border-sub-3 absolute top-full right-0 z-50 mt-2 min-w-32 rounded-lg border shadow-lg">
          <div className="py-2">
            {SORT_OPTIONS.map((option) => {
              const active = sort === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`text-caption-1 w-full cursor-pointer px-4 py-2 text-left transition-colors ${
                    active
                      ? "text-p-1 bg-surface font-medium"
                      : "text-main-text hover:bg-surface"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
