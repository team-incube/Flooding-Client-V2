import Bowl from "@/shared/asset/svg/Bowl";
import Back from "@/shared/asset/svg/Back";

const Meals = [
  "10곡잡곡밥 05",
  "추어탕.. 05, 06, 13",
  "야채계란찜 01, 02",
  "갑오징어미나리초무침 05, 06, 13, 17",
  "돈육불고기상추쌈/ 05, 06, 10, 13",
  "배추김치 09",
  "배추김치 09",
  "수리취떡",
];

export default function MealCard() {
  return (
    <div className="w-[426px] min-w-[280px] h-[478px] min-[1600px]:h-[497px] bg-background-surface rounded-2xl p-4 min-[1600px]:p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <Bowl />
          <span className="text-size-text-1 font-semibold text-main-text">
            급식표
          </span>
        </div>
        <div className="flex items-center gap-2 text-size-text-3 text-sub-1 font-medium">
          <button>
            <Back direction="left" />
          </button>
          <span>25.05.29 (목)</span>
          <button>
            <Back direction="right" />
          </button>
        </div>
      </div>

      <div className="flex rounded-lg bg-sub-4 p-2 mb-4">
        <button className="flex-1 py-3 rounded-lg bg-p-1 text-background-surface text-size-text-4 font-medium">
          조식
        </button>
        <button className="flex-1 py-3 rounded-lg text-sub-2 text-size-text-4 font-medium">
          중식
        </button>
        <button className="flex-1 py-3 rounded-lg text-sub-2 text-size-text-4 font-medium">
          석식
        </button>
      </div>

      <ul className="flex flex-col gap-3 flex-1 overflow-y-auto">
        {Meals.map((item, index) => (
          <li key={index} className="text-size-caption-1 min-[1600px]:text-size-text-1 text-sub-1 font-semibold">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
