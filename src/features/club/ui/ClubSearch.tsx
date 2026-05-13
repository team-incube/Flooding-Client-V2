import Search from "@/shared/asset/svg/Search";
import TextField from "@/shared/ui/textField";
import { TextButton } from "@/shared/ui/Button/TextButton";
import type { ClubTypeFilter } from "../lib/filterClubs";

interface ClubSearchProps {
  query: string;
  setQuery: (value: string) => void;
  onSearch: () => void;
  selectedType: ClubTypeFilter;
  onTypeChange: (type: ClubTypeFilter) => void;
}

export default function ClubSearch({
  query,
  setQuery,
  onSearch,
  selectedType,
  onTypeChange,
}: ClubSearchProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <div className="flex w-full min-w-82.5 flex-col items-start gap-4">
      <div className="w-full">
        <TextField
          placeholder="동아리명, 부장 이름 등을 입력해주세요"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          rightIcon={<Search />}
          className="w-full"
        />
      </div>

      <div className="flex w-full flex-col gap-1">
        <span className="text-text-3">동아리 유형</span>
        <div className="flex w-full gap-1">
          <TextButton
            variant={selectedType === "MAJOR_CLUB" ? "filled" : "outlined"}
            size="fit"
            className="flex-1"
            onClick={() =>
              onTypeChange(selectedType === "MAJOR_CLUB" ? "ALL" : "MAJOR_CLUB")
            }
          >
            전공
          </TextButton>
          <TextButton
            variant={selectedType === "AUTONOMOUS_CLUB" ? "filled" : "outlined"}
            size="fit"
            className="flex-1"
            onClick={() =>
              onTypeChange(
                selectedType === "AUTONOMOUS_CLUB" ? "ALL" : "AUTONOMOUS_CLUB",
              )
            }
          >
            자율
          </TextButton>
        </div>
      </div>

      <div className="w-full">
        <TextButton
          variant={query ? "filled" : "disabled"}
          onClick={onSearch}
          size="wide"
          className="w-full"
        >
          검색하기
        </TextButton>
      </div>
    </div>
  );
}
