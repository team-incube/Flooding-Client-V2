/** 학번에서 학년을 계산합니다. 예: 2401 → 2 */
export function getGrade(studentNumber: number): number {
  return Math.floor(studentNumber / 1000);
}

/** 학번에서 반을 계산합니다. 예: 2401 → 4 */
export function getClassNumber(studentNumber: number): number {
  return Math.floor((studentNumber % 1000) / 100);
}

/** 학번에서 번호를 계산합니다. 예: 2401 → 1 */
export function getStudentIndex(studentNumber: number): number {
  return studentNumber % 100;
}

/** 호실 번호에서 층을 계산합니다. 예: 201 → 2 */
export function getDormitoryFloor(dormitoryRoom: number): number {
  return Math.floor(dormitoryRoom / 100);
}
