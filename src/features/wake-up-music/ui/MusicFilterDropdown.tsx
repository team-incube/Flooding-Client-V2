import type { WakeUpMusicSort } from "@/features/wake-up-music/model/useMusicFilter";
import { Dropdown, type DropdownOption } from "@/shared/ui/Dropdown";

interface MusicFilterDropdownProps {
  sort: WakeUpMusicSort;
  onSortChange: (sort: WakeUpMusicSort) => void;
  currentFilterLabel: string;
  hasFilter: boolean;
}

const SORT_OPTIONS: DropdownOption<WakeUpMusicSort>[] = [
  { label: "시간순", value: "TIME" },
  { label: "좋아요순", value: "LIKE" },
];

export function MusicFilterDropdown({
  sort,
  onSortChange,
  currentFilterLabel,
  hasFilter,
}: MusicFilterDropdownProps) {
  return (
    <Dropdown
      options={SORT_OPTIONS}
      selectedValue={sort}
      onSelect={onSortChange}
      triggerLabel={currentFilterLabel}
      triggerClassName={`text-caption-1 cursor-pointer rounded px-2 py-1 ${
        hasFilter ? "text-p-1" : "text-sub-2 hover:bg-surface"
      }`}
    />
  );
}
