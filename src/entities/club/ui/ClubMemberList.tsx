import { ClubMember } from "../model/club";
import { groupMembersByGrade } from "../lib/groupMembersByGrade";
import { getSortedGrades } from "../lib/getSortedGrades";

interface ClubMemberListProps {
  members: ClubMember[];
  leader?: string;
}

export default function ClubMemberList({
  members,
  leader,
}: ClubMemberListProps) {
  if (members.length === 0) return null;

  const groupedMembers = groupMembersByGrade(members);
  const sortedGrades = getSortedGrades(groupedMembers);

  return (
    <div className="flex flex-col gap-2">
      <span className="2xl:text-title-4 lg:text-text-1 text-main-text">
        팀원
      </span>
      <div className="flex flex-col gap-1">
        {sortedGrades.map((grade) => {
          const gradeMembers = groupedMembers[grade];
          return (
            <div key={grade} className="text-text-1">
              <span className="text-sub-1">{grade}학년 - </span>
              {gradeMembers.map((m, i) => {
                const isLeader = m.name === leader;
                return (
                  <span key={m.id}>
                    <span className={isLeader ? "text-p-1" : "text-sub-1"}>
                      {m.name}
                    </span>
                    {i < gradeMembers.length - 1 && (
                      <span className="text-sub-1">, </span>
                    )}
                  </span>
                );
              })}
            </div>
          );
        })}
        <p className="2xl:text-text-4 lg:text-caption-1 text-sub-2 mt-1">
          ※ 보라색 이름은 부장이에요
        </p>
      </div>
    </div>
  );
}
