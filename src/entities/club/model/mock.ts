import {
  Club,
  ClubDetailResponse,
  ClubMember,
  ProjectParticipant,
} from "./club";

export const MOCK_CLUBS: Club[] = [
  {
    id: 1,
    name: "인력사무소",
    type: "개발",
    leader: "김민솔",
    description:
      "우리는 뭘 하고 뭘 해서 이걸 하는 동아리 선후배사이는 어쩌고 저쩌고 좋고 그래서 동아리가 잘 돌아감",
    imageUrl: "",
    totalMember: 10,
  },
  {
    id: 2,
    name: "동아리명",
    type: "디자인",
    leader: "홍길동",
    description:
      "동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명",
    imageUrl: "/hq720.jpg",
    totalMember: 10,
  },
  {
    id: 3,
    name: "동아리명",
    type: "개발",
    leader: "홍길동",
    description:
      "동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명",
    imageUrl: "/hq720.jpg",
    totalMember: 10,
  },
  {
    id: 4,
    name: "동아리명",
    type: "개발",
    leader: "홍길동",
    description:
      "동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명",
    imageUrl: "/hq720.jpg",
    totalMember: 10,
  },
  {
    id: 5,
    name: "동아리명",
    type: "디자인",
    leader: "홍길동",
    description:
      "동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명",
    imageUrl: "/hq720.jpg",
    totalMember: 10,
  },
  {
    id: 6,
    name: "동아리명",
    type: "개발",
    leader: "홍길동",
    description:
      "동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명",
    imageUrl: "/hq720.jpg",
    totalMember: 10,
  },
  {
    id: 7,
    name: "동아리명",
    type: "개발",
    leader: "홍길동",
    description:
      "동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명",
    imageUrl: "/hq720.jpg",
    totalMember: 10,
  },
  {
    id: 8,
    name: "동아리명",
    type: "디자인",
    leader: "홍길동",
    description:
      "동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명",
    imageUrl: "/hq720.jpg",
    totalMember: 10,
  },
  {
    id: 9,
    name: "동아리명",
    type: "개발",
    leader: "홍길동",
    description:
      "동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명",
    imageUrl: "/hq720.jpg",
    totalMember: 10,
  },
  {
    id: 10,
    name: "동아리명",
    type: "디자인",
    leader: "홍길동",
    description:
      "동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명",
    imageUrl: "/hq720.jpg",
    totalMember: 10,
  },
];

const MEMBERS: ClubMember[] = [
  {
    id: 1,
    name: "김민솔",
    studentNumber: 3411,
    sex: "WOMAN",
  },
  {
    id: 2,
    name: "김봄",
    studentNumber: 3311,
    sex: "MAN",
  },
  {
    id: 3,
    name: "황지훈",
    studentNumber: 3211,
    sex: "MAN",
  },
  {
    id: 4,
    name: "이주언",
    studentNumber: 3111,
    sex: "WOMAN",
  },
  {
    id: 5,
    name: "한의준",
    studentNumber: 2201,
    sex: "MAN",
  },
  {
    id: 6,
    name: "김동현",
    studentNumber: 2101,
    sex: "MAN",
  },
  {
    id: 7,
    name: "앙은준",
    studentNumber: 2202,
    sex: "MAN",
  },
  {
    id: 8,
    name: "정수진",
    studentNumber: 2203,
    sex: "WOMAN",
  },
  {
    id: 9,
    name: "정윤서",
    studentNumber: 2104,
    sex: "WOMAN",
  },
  {
    id: 10,
    name: "류수연",
    studentNumber: 2205,
    sex: "WOMAN",
  },
];

const PROJECT1_PARTICIPANTS: ProjectParticipant[] = [
  { id: 1, name: "김민솔", studentNumber: 3411, sex: "WOMAN" },
  { id: 2, name: "김봄", studentNumber: 3211, sex: "WOMAN" },
  { id: 11, name: "이상혁", studentNumber: 3311, sex: "MAN" },
  { id: 12, name: "김태은", studentNumber: 3111, sex: "MAN" },
  { id: 13, name: "이세민", studentNumber: 3112, sex: "MAN" },
  { id: 4, name: "이주언", studentNumber: 3113, sex: "MAN" },
  { id: 14, name: "나현욱", studentNumber: 3114, sex: "MAN" },
];

export const MOCK_CLUB_DETAILS: Record<number, ClubDetailResponse> = {
  1: {
    club: {
      id: 1,
      name: "인력사무소",
      type: "개발",
      description:
        "우리는 뭘 하고 뭘 해서 이걸 하는 동아리 선후배사이는 어쩌고 저쩌고 좋고 그래서 동아리가 잘 돌아감",
      imageUrl: "",
      leader: "김민솔",
      maxMember: 30,
    },
    member: MEMBERS,
    project: [
      {
        id: 1,
        name: "프로젝트 이름",
        imageUrl: "/hq720.jpg",
        description:
          "프젝설명 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 프젝설명 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고",
        participants: PROJECT1_PARTICIPANTS,
        links: [
          { type: "링크", link: "https://github.com" },
          { type: "링크", link: "https://notion.so" },
          { type: "링크", link: "https://example.com" },
          { type: "링크", link: "https://figma.com" },
          { type: "링크", link: "https://example2.com" },
        ],
      },
      {
        id: 2,
        name: "프로젝트 이름",
        imageUrl: "/hq720.jpg",
        description:
          "프젝설명 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 프젝설명 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고",
        participants: PROJECT1_PARTICIPANTS,
        links: [
          { type: "링크", link: "https://github.com" },
          { type: "링크", link: "https://notion.so" },
          { type: "링크", link: "https://example.com" },
          { type: "링크", link: "https://figma.com" },
          { type: "링크", link: "https://example2.com" },
        ],
      },
    ],
  },
};
