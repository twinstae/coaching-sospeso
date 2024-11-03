export const TEST_SOSPESO_LIST_ITEM = {
  id: crypto.randomUUID(),
  from: "탐정토끼",
  to: "퀴어 문화 축제 올 사람",
};

export const ISSUED_SOSPESO = {
  id: "2a88cac2-c021-48c6-9288-ecf0464d5bc2",
  from: { id: "1234", nickname: "탐정토끼" },
  to: "퀴어 문화 축제 올 사람",
  status: "issued", // 읽기 모델 "issued" | "pending" | "consumed"
  consuming: undefined,
} as const;

export const PENDING_SOSPESO = {
  id: "2a88cac2-c021-48c6-9288-ecf0464d5bc2",
  from: { id: "1234", nickname: "탐정토끼" },
  to: "퀴어 문화 축제 올 사람",
  status: "pending", // 읽기 모델 "issued" | "pending" | "consumed"
  consuming: undefined,
} as const;

export const CONSUMED_SOSPESO = {
  id: "2a88cac2-c021-48c6-9288-ecf0464d5bc2",
  from: { id: "1234", nickname: "탐정토끼" },
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
