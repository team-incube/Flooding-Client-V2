import Search from "@/shared/asset/svg/Search";
import TextField from "@/shared/ui/textField";
import { TextButton } from "@/shared/ui/Button/TextButton";

interface ClubSearchProps {
  query: string;
  setQuery: (value: string) => void;
  onSearch: () => void;
}

export default function ClubSearch({
  query,
  setQuery,
  onSearch,
}: ClubSearchProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <div className="flex w-full min-w-82.5 flex-col items-start gap-4">
      <div className="w-full">
        <TextField
          placeholder="동아리명, 부장 이름등을 입력해주세요"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          rightIcon={<Search />}
          className="w-full"
        />
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
