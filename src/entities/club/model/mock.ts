import {
  ClubApplicationListResponse,
  Club,
  ClubDetailResponse,
  ClubForm,
  ClubMember,
  ProjectParticipant,
} from './club';

export const MOCK_CLUBS: Club[] = [
  {
    id: 1,
    name: '인력사무소',
    type: 'MAJOR_CLUB',
    leader: '김민솔',
    description: '조보기능/프론트 노동기능을 갖춘 선후배 팀원이 함께하는 개발 동아리',
    imageUrl: undefined,
    totalMember: 10,
  },
  {
    id: 2,
    name: '픽셀',
    type: 'MAJOR_CLUB',
    description: 'UI/UX 디자인과 브랜딩을 연구하는 디자인 동아리',
    imageUrl: undefined,
    totalMember: 0,
  },
  {
    id: 3,
    name: '알고리즘반',
    type: 'MAJOR_CLUB',
    description: '알고리즘 문제 풀이와 코딩 테스트를 준비하는 동아리',
    imageUrl: undefined,
    totalMember: 0,
  },
  {
    id: 4,
    name: '보안연구반',
    type: 'AUTONOMOUS_CLUB',
    description: '정보보안과 CTF 대회 참가를 목표로 활동하는 동아리',
    imageUrl: undefined,
    totalMember: 0,
  },
  {
    id: 5,
    name: '게임개발팀',
    type: 'AUTONOMOUS_CLUB',
    description: 'Unity를 이용한 게임 개발을 목표로 하는 동아리',
    imageUrl: undefined,
    totalMember: 0,
  },
];

const MEMBERS: ClubMember[] = [
  { id: 1,  name: '김민솔', studentNumber: 3411, sex: 'WOMAN', specialty: 'FE' },
  { id: 2,  name: '김봄',   studentNumber: 3311, sex: 'MAN',   specialty: 'BE' },
  { id: 3,  name: '황지훈', studentNumber: 3211, sex: 'MAN',   specialty: 'BE' },
  { id: 4,  name: '이주언', studentNumber: 3111, sex: 'WOMAN', specialty: 'FE' },
  { id: 5,  name: '한의준', studentNumber: 2201, sex: 'MAN',   specialty: 'FE' },
  { id: 6,  name: '김동현', studentNumber: 2101, sex: 'MAN',   specialty: 'BE' },
  { id: 7,  name: '양은준', studentNumber: 2202, sex: 'MAN',   specialty: 'Flutter' },
  { id: 8,  name: '정수진', studentNumber: 2203, sex: 'WOMAN', specialty: 'Designer' },
  { id: 9,  name: '정윤서', studentNumber: 2104, sex: 'WOMAN', specialty: 'FE' },
  { id: 10, name: '류수연', studentNumber: 2205, sex: 'WOMAN', specialty: 'Flutter' },
];

const PROJECT1_PARTICIPANTS: ProjectParticipant[] = [
  { id: 1,  name: '김민솔', studentNumber: 3411, sex: 'WOMAN', specialty: 'FE' },
  { id: 2,  name: '김봄',   studentNumber: 3311, sex: 'MAN',   specialty: 'BE' },
  { id: 3,  name: '황지훈', studentNumber: 3211, sex: 'MAN',   specialty: 'BE' },
  { id: 4,  name: '이주언', studentNumber: 3111, sex: 'WOMAN', specialty: 'FE' },
  { id: 5,  name: '한의준', studentNumber: 2201, sex: 'MAN',   specialty: 'FE' },
];

export const MOCK_CLUB_DETAILS: Record<number, ClubDetailResponse> = {
  1: {
    isLeader: false,
    club: {
      id: 1,
      name: '인력사무소',
      type: 'MAJOR_CLUB',
      leader: '김민솔',
      description: '조보기능/프론트 노동기능을 갖춘 선후배 팀원이 함께하는 개발 동아리',
      imageUrl: undefined,
      maxMember: 30,
    },
    members: MEMBERS,
    projects: [
      {
        id: 1,
        name: '프로젝트 이름',
        imageUrl: '/hq720.jpg',
        description:
          '프젝설명 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 프젝설명 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고',
        participants: PROJECT1_PARTICIPANTS,
        links: [
          { type: '링크', link: 'https://github.com' },
          { type: '링크', link: 'https://notion.so' },
          { type: '링크', link: 'https://example.com' },
          { type: '링크', link: 'https://figma.com' },
          { type: '링크', link: 'https://example2.com' },
        ],
      },
      {
        id: 2,
        name: '프로젝트 이름',
        imageUrl: '/hq720.jpg',
        description:
          '프젝설명 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 프젝설명 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고',
        participants: PROJECT1_PARTICIPANTS,
        links: [
          { type: '링크', link: 'https://github.com' },
          { type: '링크', link: 'https://notion.so' },
          { type: '링크', link: 'https://example.com' },
          { type: '링크', link: 'https://figma.com' },
          { type: '링크', link: 'https://example2.com' },
        ],
      },
    ],
  },
  2: {
    isLeader: false,
    club: {
      id: 2,
      name: '픽셀',
      type: 'MAJOR_CLUB',
      description: 'UI/UX 디자인과 브랜딩을 연구하는 디자인 동아리',
      imageUrl: undefined,
      maxMember: 20,
    },
    members: [],
    projects: [],
  },
  3: {
    isLeader: false,
    club: {
      id: 3,
      name: '알고리즘반',
      type: 'MAJOR_CLUB',
      description: '알고리즘 문제 풀이와 코딩 테스트를 준비하는 동아리',
      imageUrl: undefined,
      maxMember: 25,
    },
    members: [],
    projects: [],
  },
  4: {
    isLeader: false,
    club: {
      id: 4,
      name: '보안연구반',
      type: 'AUTONOMOUS_CLUB',
      description: '정보보안과 CTF 대회 참가를 목표로 활동하는 동아리',
      imageUrl: undefined,
      maxMember: 20,
    },
    members: [],
    projects: [],
  },
  5: {
    isLeader: false,
    club: {
      id: 5,
      name: '게임개발팀',
      type: 'AUTONOMOUS_CLUB',
      description: 'Unity를 이용한 게임 개발을 목표로 하는 동아리',
      imageUrl: undefined,
      maxMember: 15,
    },
    members: [],
    projects: [],
  },
};

export const MOCK_CLUB_FORMS: Record<number, ClubForm> = {
  1: {
    formId: 1,
    title: '인력사무소 동아리 신청',
    description: '인력사무소에서 함께 활동하고 싶은 이유를 알려주세요.',
    fields: [
      {
        fieldId: 1,
        label: '지원 동기',
        description: '동아리에 지원한 이유를 간단히 작성해주세요.',
        fieldType: 'TEXTAREA',
        order: 1,
        required: true,
        options: [],
      },
      {
        fieldId: 2,
        label: '희망 분야',
        fieldType: 'RADIO',
        order: 2,
        required: true,
        options: [
          { optionId: 1, label: '프론트엔드', value: 'FRONTEND' },
          { optionId: 2, label: '백엔드', value: 'BACKEND' },
          { optionId: 3, label: '디자인', value: 'DESIGN' },
        ],
      },
      {
        fieldId: 3,
        label: '사용 가능한 기술',
        fieldType: 'CHECKBOX',
        order: 3,
        required: false,
        options: [
          { optionId: 4, label: 'React', value: 'REACT' },
          { optionId: 5, label: 'Spring', value: 'SPRING' },
          { optionId: 6, label: 'Figma', value: 'FIGMA' },
        ],
      },
      {
        fieldId: 4,
        label: '학년',
        fieldType: 'DROPDOWN',
        order: 4,
        required: true,
        options: [
          { optionId: 7, label: '1학년', value: '1' },
          { optionId: 8, label: '2학년', value: '2' },
          { optionId: 9, label: '3학년', value: '3' },
        ],
      },
      {
        fieldId: 5,
        label: '연락 가능한 이메일',
        fieldType: 'TEXT',
        order: 5,
        required: true,
        options: [],
      },
    ],
  },
  2: {
    formId: 2,
    title: '픽셀 동아리 신청',
    description: '디자인 관심 분야와 경험을 작성해주세요.',
    fields: [
      {
        fieldId: 6,
        label: '관심 있는 디자인 분야',
        fieldType: 'TEXT',
        order: 1,
        required: true,
        options: [],
      },
      {
        fieldId: 7,
        label: '포트폴리오 링크',
        fieldType: 'TEXT',
        order: 2,
        required: false,
        options: [],
      },
    ],
  },
};

export const MOCK_CLUB_APPLICATIONS: Record<number, ClubApplicationListResponse> = {
  1: {
    applications: [
      {
        submissionId: 1,
        applicant: {
          id: 101,
          name: "박도윤",
          studentNumber: 1401,
        },
        submittedAt: "2026-04-27T09:20:00",
        answers: [
          {
            fieldId: 1,
            label: "지원 동기",
            value: "프론트엔드와 백엔드를 모두 경험해보고 싶어서 지원했습니다.",
          },
          {
            fieldId: 2,
            label: "희망 분야",
            value: "FRONTEND",
          },
          {
            fieldId: 3,
            label: "사용 가능한 기술",
            value: "REACT, FIGMA",
          },
          {
            fieldId: 4,
            label: "학년",
            value: "1",
          },
          {
            fieldId: 5,
            label: "연락 가능한 이메일",
            value: "doyun@example.com",
          },
        ],
      },
      {
        submissionId: 2,
        applicant: {
          id: 102,
          name: "이서현",
          studentNumber: 2312,
        },
        submittedAt: "2026-04-27T10:05:00",
        answers: [
          {
            fieldId: 1,
            label: "지원 동기",
            value: "실제 서비스 개발 흐름을 배우고 팀 프로젝트를 경험하고 싶습니다.",
          },
          {
            fieldId: 2,
            label: "희망 분야",
            value: "BACKEND",
          },
          {
            fieldId: 5,
            label: "연락 가능한 이메일",
            value: "seohyeon@example.com",
          },
        ],
      },
    ],
  },
  2: {
    applications: [],
  },
};
