import { ClubMember } from "../model/club";

interface ClubMemberListProps {
  members: ClubMember[];
}

function groupByGeneration(members: ClubMember[]): Map<string, ClubMember[]> {
  const map = new Map<string, ClubMember[]>();
  for (const m of members) {
    if (m.generation === undefined) continue;
    const key = String(m.generation);
    const list = map.get(key) ?? [];
    list.push(m);
    map.set(key, list);
  }
  return map;
}

export default function ClubMemberList({ members }: ClubMemberListProps) {
  const generationMap = groupByGeneration(members);
  const generations = Array.from(generationMap.keys()).sort(
    (a, b) => Number(a) - Number(b)
  );

  if (generations.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <span className="2xl:text-title-4 lg:text-text-1 text-main-text">
        팀원
      </span>
      <div className="flex flex-col gap-1">
        {generations.map((gen) => {
          const genMembers = generationMap.get(gen)!;
          return (
            <div key={gen} className="flex gap-1 text-text-1">
              <span className="text-sub-1 shrink-0">
                {`${gen}기 -`}
              </span>
              <span>
                {genMembers.map((m, i) => (
                  <span key={m.id}>
                    <span className={m.isLeader ? "text-p-1" : "text-sub-1"}>
                      {m.name}
                    </span>
                    {m.role && <span className="text-sub-1"> ({m.role})</span>}
                    {i < genMembers.length - 1 && (
                      <span className="text-sub-1">, </span>
                    )}
                  </span>
                ))}
              </span>
            </div>
          );
        })}
        <p className="2xl:text-text-4 lg:text-caption-1 text-sub-2 mt-1">
          ※ 보라색 이름은 부장, 차장이에요
        </p>
      </div>
    </div>
  );
}
