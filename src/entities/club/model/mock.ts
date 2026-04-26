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
    type: "전공동아리",
    leader: "김민솔",
    description:
      "조보기능/프론트 노동기능을 갖춘 선후배 팀원이 함께하는 개발 동아리",
    imageUrl: "",
    totalMember: 10,
  },
  {
    id: 2,
    name: "픽셀",
    type: "전공동아리",
    leader: "",
    description: "UI/UX 디자인과 브랜딩을 연구하는 디자인 동아리",
    imageUrl: "",
    totalMember: 0,
  },
  {
    id: 3,
    name: "알고리즘반",
    type: "전공동아리",
    leader: "",
    description: "알고리즘 문제 풀이와 코딩 테스트를 준비하는 동아리",
    imageUrl: "",
    totalMember: 0,
  },
  {
    id: 4,
    name: "보안연구반",
    type: "자율동아리",
    leader: "",
    description: "정보보안과 CTF 대회 참가를 목표로 활동하는 동아리",
    imageUrl: "",
    totalMember: 0,
  },
  {
    id: 5,
    name: "게임개발팀",
    type: "자율동아리",
    leader: "",
    description: "Unity를 이용한 게임 개발을 목표로 하는 동아리",
    imageUrl: "",
    totalMember: 0,
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
    name: "양은준",
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
      type: "전공동아리",
      description:
        "조보기능/프론트 노동기능을 갖춘 선후배 팀원이 함께하는 개발 동아리",
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
  2: {
    club: {
      id: 2,
      name: "픽셀",
      type: "전공동아리",
      description: "UI/UX 디자인과 브랜딩을 연구하는 디자인 동아리",
      imageUrl: "",
      leader: "",
      maxMember: 20,
    },
    member: [],
    project: [],
  },
  3: {
    club: {
      id: 3,
      name: "알고리즘반",
      type: "전공동아리",
      description: "알고리즘 문제 풀이와 코딩 테스트를 준비하는 동아리",
      imageUrl: "",
      leader: "",
      maxMember: 25,
    },
    member: [],
    project: [],
  },
  4: {
    club: {
      id: 4,
      name: "보안연구반",
      type: "자율동아리",
      description: "정보보안과 CTF 대회 참가를 목표로 활동하는 동아리",
      imageUrl: "",
      leader: "",
      maxMember: 20,
    },
    member: [],
    project: [],
  },
  5: {
    club: {
      id: 5,
      name: "게임개발팀",
      type: "자율동아리",
      description: "Unity를 이용한 게임 개발을 목표로 하는 동아리",
      imageUrl: "",
      leader: "",
      maxMember: 15,
    },
    member: [],
    project: [],
  },
};
