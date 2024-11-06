import type { SospesoApplicationStatus } from "./domain.ts";

export const TEST_SOSPESO_LIST_ITEM = {
  id: crypto.randomUUID(),
  from: "탐정토끼",
  to: "퀴어 문화 축제 올 사람",
};

export const ISSUED_SOSPESO = {
  id: "2a88cac2-c021-48c6-9288-ecf0464d5bc2",
  from: "탐정토끼",
  to: "퀴어 문화 축제 올 사람",
  status: "issued", // 읽기 모델 "issued" | "pending" | "consumed"
  consuming: undefined,
} as const;

export const PENDING_SOSPESO = {
  id: "2a88cac2-c021-48c6-9288-ecf0464d5bc2",
  from: "탐정토끼",
  to: "퀴어 문화 축제 올 사람",
  status: "pending", // 읽기 모델 "issued" | "pending" | "consumed"
  consuming: undefined,
} as const;

export const CONSUMED_SOSPESO = {
  id: "2a88cac2-c021-48c6-9288-ecf0464d5bc2",
  from: "탐정토끼",
  to: "퀴어 문화 축제 올 사람",
  status: "consumed", // 읽기 모델 "issued" | "pending" | "consumed"
  consuming: {
    consumer: {
      id: "444",
      nickname: "촛불이",
    },
    content: "탐토에게 테스트 코칭을 받아서 너무 좋았어요!",
  },
} as const;

export const TEST_APPLICATION_LIST: {
  id: string;
  sospesoId: string;
  to: string;
  status: SospesoApplicationStatus;
  appliedAt: Date;
  applicant: {
    id: string;
    nickname: string;
  };
  content: string;
}[] = [
  {
    id: crypto.randomUUID(),
    sospesoId: crypto.randomUUID(),
    to: "퀴어 문화 축제 올 사람",
    status: "applied",
    appliedAt: new Date(),
    applicant: {
      id: crypto.randomUUID(),
      nickname: "김토끼",
    },
    content:
      "저는 김씨가문 김유신의 52대손으로 태어나 어쩌구... 올해 퀴어 문화 축제에도 다녀왔으며, 모든 성소수자들을 지지합니다.",
  },
  {
    id: crypto.randomUUID(),
    sospesoId: crypto.randomUUID(),
    to: "퀴어 문화 축제 올 사람",
    status: "rejected",
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    applicant: {
      id: crypto.randomUUID(),
      nickname: "혐오자",
    },
    content: "저는 소스페소에 이상한 요청을 보낸 나쁜 사람입니다",
  },
  {
    id: crypto.randomUUID(),
    sospesoId: crypto.randomUUID(),
    to: "시각 장애가 있는 분",
    status: "approved",
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    applicant: {
      id: crypto.randomUUID(),
      nickname: "해적 토끼",
    },
    content: "제 왼쪽 눈을 보십시오. 이것이야 말로 증거가 아니겠습니까?ㄷ",
  },
];
