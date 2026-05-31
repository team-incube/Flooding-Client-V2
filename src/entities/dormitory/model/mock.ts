import type {
  MyPenaltyResponse,
  AllPenaltiesResponse,
  CleaningZones,
  CleaningZoneDetail,
  MassageApplicants,
  StudyApplicants,
} from "@/entities/dormitory/model/dormitory";

export const MOCK_MASSAGE_APPLICANTS: MassageApplicants = {
  isApplicationOpen: true,
  myApplicationStatus: null,
  applicants: [
    {
      order: 1,
      name: "홍길동",
      studentNumber: 1101,
      sex: "MAN",
    },
    {
      order: 2,
      name: "김민솔",
      studentNumber: 3411,
      sex: "WOMAN",
    },
    {
      order: 3,
      name: "박지훈",
      studentNumber: 2307,
      sex: "MAN",
    },
  ],
};

export const MOCK_STUDY_APPLICANTS: StudyApplicants = {
  isApplicationOpen: true,
  myApplicationStatus: null,
  applicants: [
    {
      userId: 1,
      name: "김민솔",
      studentNumber: 3411,
      sex: "WOMAN",
      isBanned: false,
      isChecked: false,
    },
    {
      userId: 2,
      name: "이도윤",
      studentNumber: 2208,
      sex: "MAN",
      isBanned: false,
      isChecked: true,
    },
    {
      userId: 3,
      name: "최서연",
      studentNumber: 1304,
      sex: "WOMAN",
      isBanned: false,
      isChecked: false,
    },
    {
      userId: 4,
      name: "박지훈",
      studentNumber: 2307,
      sex: "MAN",
      isBanned: false,
      isChecked: false,
    },
  ],
};

export const MOCK_MY_PENALTY: MyPenaltyResponse = {
  penaltyScore: 3,
};

export const MOCK_ALL_PENALTIES: AllPenaltiesResponse = {
  content: [
    {
      userId: 1,
      name: "홍길동",
      studentNumber: 10101,
      penaltyScore: 5,
    },
    {
      userId: 2,
      name: "김철수",
      studentNumber: 10102,
      penaltyScore: 3,
    },
    {
      userId: 3,
      name: "이영희",
      studentNumber: 10201,
      penaltyScore: 1,
    },
  ],
  totalElements: 3,
  totalPages: 1,
  last: true,
  size: 20,
  number: 0,
  first: true,
  numberOfElements: 3,
  empty: false,
};

export const MOCK_CLEANING_ZONES: CleaningZones[] = [
  {
    id: 1,
    name: "1층 복도",
    description: "1층 현관부터 계단까지의 복도 구역",
    memberCount: 3,
  },
  {
    id: 2,
    name: "2층 화장실",
    description: "2층 남자 화장실 청소 구역",
    memberCount: 2,
  },
  {
    id: 3,
    name: "식당",
    description: "기숙사 식당 바닥 및 테이블 청소 구역",
    memberCount: 4,
  },
];

export const MOCK_CLEANING_ZONE_DETAIL: CleaningZoneDetail = {
  id: 1,
  name: "1층 복도",
  description: "1층 현관부터 계단까지의 복도 구역",
  members: [
    {
      userId: 1,
      name: "홍길동",
      studentNumber: 10101,
    },
    {
      userId: 2,
      name: "김철수",
      studentNumber: 10102,
    },
    {
      userId: 3,
      name: "이영희",
      studentNumber: 10201,
    },
  ],
};
