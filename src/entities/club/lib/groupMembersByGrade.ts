import { getGrade } from "@/entities/user/lib/getUserInfo";
import type { ClubMember } from "../model/club";

export function groupMembersByGrade(
  members: ClubMember[],
): Record<number, ClubMember[]> {
  return members.reduce<Record<number, ClubMember[]>>((acc, member) => {
    const grade = getGrade(member.studentNumber);
    if (!acc[grade]) acc[grade] = [];
    acc[grade].push(member);
    return acc;
  }, {});
}
