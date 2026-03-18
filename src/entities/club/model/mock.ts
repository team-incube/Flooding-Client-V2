import { Club, ClubDetail, ClubMember } from "./club";

export const MOCK_CLUBS: Club[] = [
  {
    id: 1,
    name: "인력사무소",
    type: "개발",
    description:
      "우리는 뭘 하고 뭘 해서 이걸 하는 동아리 선후배사이는 어쩌고 저쩌고 좋고 그래서 동아리가 잘 돌아감",
    imageUrl: "",
    totalMember: 20,
  },
  {
    id: 2,
    name: "동아리명",
    type: "디자인",
    description:
      "동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명",
    imageUrl: "/hq720.jpg",
    totalMember: 15,
  },
  {
    id: 3,
    name: "동아리명",
    type: "개발",
    description:
      "동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명",
    imageUrl: "/hq720.jpg",
    totalMember: 20,
  },
  {
    id: 4,
    name: "동아리명",
    type: "개발",
    description:
      "동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명",
    imageUrl: "/hq720.jpg",
    totalMember: 10,
  },
  {
    id: 5,
    name: "동아리명",
    type: "디자인",
    description:
      "동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명",
    imageUrl: "/hq720.jpg",
    totalMember: 12,
  },
  {
    id: 6,
    name: "동아리명",
    type: "개발",
    description:
      "동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명",
    imageUrl: "/hq720.jpg",
    totalMember: 15,
  },
  {
    id: 7,
    name: "동아리명",
    type: "개발",
    description:
      "동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명",
    imageUrl: "/hq720.jpg",
    totalMember: 20,
  },
  {
    id: 8,
    name: "동아리명",
    type: "디자인",
    description:
      "동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명",
    imageUrl: "/hq720.jpg",
    totalMember: 10,
  },
  {
    id: 9,
    name: "동아리명",
    type: "개발",
    description:
      "동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명",
    imageUrl: "/hq720.jpg",
    totalMember: 15,
  },
  {
    id: 10,
    name: "동아리명",
    type: "디자인",
    description:
      "동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명동아리 설명",
    imageUrl: "/hq720.jpg",
    totalMember: 8,
  },
];

const GEN8_MEMBERS: ClubMember[] = [
  {
    id: 1,
    name: "김민솔",
    studentNumber: 20210001,
    sex: "WOMAN",
    major: "컴퓨터공학부",
    role: "Designer",
    generation: 8,
    isLeader: true,
  },
  {
    id: 2,
    name: "김볼",
    studentNumber: 20210045,
    sex: "MAN",
    major: "컴퓨터공학부",
    role: "FE",
    generation: 8,
  },
  {
    id: 3,
    name: "황지훈",
    studentNumber: 20210087,
    sex: "MAN",
    major: "소프트웨어학부",
    role: "BE",
    generation: 8,
  },
  {
    id: 4,
    name: "이주연",
    studentNumber: 20210112,
    sex: "WOMAN",
    major: "모바일시스템공학과",
    role: "Flutter",
    generation: 8,
  },
];

const GEN9_MEMBERS: ClubMember[] = [
  {
    id: 5,
    name: "한의준",
    studentNumber: 20220023,
    sex: "MAN",
    major: "소프트웨어학부",
    role: "BE",
    generation: 9,
    isLeader: true,
  },
  {
    id: 6,
    name: "김동현",
    studentNumber: 20220056,
    sex: "MAN",
    major: "컴퓨터공학부",
    role: "BE",
    generation: 9,
  },
  {
    id: 7,
    name: "앙은준",
    studentNumber: 20220078,
    sex: "MAN",
    major: "컴퓨터공학부",
    role: "FE",
    generation: 9,
  },
  {
    id: 8,
    name: "정수진",
    studentNumber: 20220099,
    sex: "WOMAN",
    major: "소프트웨어학부",
    role: "FE",
    generation: 9,
  },
  {
    id: 9,
    name: "정윤서",
    studentNumber: 20220134,
    sex: "WOMAN",
    major: "컴퓨터공학부",
    role: "FE",
    generation: 9,
  },
  {
    id: 10,
    name: "류수연",
    studentNumber: 20220167,
    sex: "WOMAN",
    major: "모바일시스템공학과",
    role: "Flutter",
    generation: 9,
  },
];

const PROJECT1_MEMBERS: ClubMember[] = [
  {
    id: 1,
    name: "김민솔",
    studentNumber: 20210001,
    sex: "WOMAN",
    major: "컴퓨터공학부",
    role: "Designer",
    generation: 8,
    isLeader: true,
  },
  {
    id: 2,
    name: "김볼",
    studentNumber: 20210045,
    sex: "MAN",
    major: "컴퓨터공학부",
    role: "FE",
    generation: 8,
  },
  {
    id: 11,
    name: "이상혁",
    studentNumber: 20210200,
    sex: "MAN",
    major: "컴퓨터공학부",
    role: "FE",
    generation: 8,
  },
  {
    id: 12,
    name: "김태은",
    studentNumber: 20210201,
    sex: "WOMAN",
    major: "소프트웨어학부",
    role: "BE",
    generation: 8,
  },
  {
    id: 13,
    name: "이세민",
    studentNumber: 20210202,
    sex: "MAN",
    major: "소프트웨어학부",
    role: "BE",
    generation: 8,
  },
  {
    id: 4,
    name: "이주연",
    studentNumber: 20210112,
    sex: "WOMAN",
    major: "모바일시스템공학과",
    role: "Flutter",
    generation: 8,
  },
  {
    id: 14,
    name: "나현욱",
    studentNumber: 20210203,
    sex: "MAN",
    major: "모바일시스템공학과",
    role: "Flutter",
    generation: 8,
  },
];

export const MOCK_CLUB_DETAILS: Record<number, ClubDetail> = {
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
    member: [...GEN8_MEMBERS, ...GEN9_MEMBERS],
    project: [
      {
        id: 1,
        name: "프로젝트 이름",
        imageUrl: "/hq720.jpg",
        description:
          "프젝설명 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 프젝설명 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고",
        participants: { member: PROJECT1_MEMBERS },
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
        participants: { member: PROJECT1_MEMBERS },
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
