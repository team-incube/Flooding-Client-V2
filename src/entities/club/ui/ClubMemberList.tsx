import type { ClubMember } from "../model/club";
import { groupMembersByGrade } from "../lib/groupMembersByGrade";
import { getSortedGrades } from "../lib/getSortedGrades";

interface ClubMemberListProps {
  members: ClubMember[];
  leader?: string;
  showDescription?: boolean;
  isLeader?: boolean;
  onMemberClick?: (member: ClubMember) => void;
}

export default function ClubMemberList({
  members,
  leader,
  showDescription = true,
  isLeader = false,
  onMemberClick,
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
                const isCurrentLeader = m.name === leader;
                const isClickable =
                  isLeader && !isCurrentLeader && !!onMemberClick;
                return (
                  <span key={m.id}>
                    <span
                      className={`${isCurrentLeader ? "text-p-1" : "text-sub-1"} ${isClickable ? "cursor-pointer hover:text-p-1" : ""}`}
                      onClick={isClickable ? () => onMemberClick(m) : undefined}
                    >
                      {m.name}
                      {m.specialty && (
                        <span className="text-sub-1"> ({m.specialty})</span>
                      )}
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
        {showDescription && (
          <p className="2xl:text-text-4 lg:text-caption-1 text-sub-2 mt-1">
            ※ 보라색 이름은 부장이에요
            {isLeader && " · 이름을 클릭해 소유권을 위임할 수 있어요"}
          </p>
        )}
      </div>
    </div>
  );
}
