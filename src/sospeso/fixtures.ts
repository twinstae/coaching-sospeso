import { generateNanoId } from "@/adapters/generateId.ts";
import type {
  Sospeso,
  SospesoApplicationStatus,
  SospesoStatus,
} from "./domain.ts";
import { Faker, ko } from "@faker-js/faker";
import { TEST_ADMIN_USER_ID, TEST_USER_ID } from "@/auth/fixtures.ts";
import invariant from "@/invariant.ts";
import { TEST_NOW } from "@/actions/fixtures.ts";

const generateId = generateNanoId;
export const TEST_SOSPESO_ID = "DaLNnQs8nfVgs0";

export const TEST_ISSUED_AT = new Date("2024-11-09T00:00:00Z");

export const TEST_SOSPESO_LIST_ITEM = {
  id: "7pD2z_SkcIWR75",
  from: "탐정토끼",
  to: "퀴어 문화 축제 올 사람",
  issuedAt: TEST_ISSUED_AT,
  status: "issued", // 읽기 모델 "issued" | "pending" | "consumed"
} as const;

export const ISSUED_SOSPESO = {
  id: TEST_SOSPESO_ID,
  from: "탐정토끼",
  to: "퀴어 문화 축제 올 사람",
  status: "issued", // 읽기 모델 "issued" | "pending" | "consumed"
  consuming: undefined,
} as const;

export const PENDING_SOSPESO = {
  id: TEST_SOSPESO_ID,
  from: "탐정토끼",
  to: "퀴어 문화 축제 올 사람",
  status: "pending", // 읽기 모델 "issued" | "pending" | "consumed"
  consuming: undefined,
} as const;

export const CONSUMED_SOSPESO = {
  id: TEST_SOSPESO_ID,
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

export const TEST_APPLIED_APPLICATION = {
  id: generateId(),
  sospesoId: generateId(),
  to: "퀴어 문화 축제 올 사람",
  status: "applied",
  appliedAt: TEST_NOW,
  applicant: {
    id: generateId(),
    nickname: "김토끼",
  },
  content:
    "저는 김씨가문 김유신의 52대손으로 태어나 어쩌구... 올해 퀴어 문화 축제에도 다녀왔으며, 모든 성소수자들을 지지합니다.",
} as const;

export const TEST_APPROVED_APPLICATION = {
  id: generateId(),
  sospesoId: generateId(),
  to: "시각 장애가 있는 분",
  status: "approved",
  appliedAt: new Date(TEST_NOW.valueOf() - 1000 * 60 * 60 * 24),
  applicant: {
    id: generateId(),
    nickname: "해적 토끼",
  },
  content: "제 왼쪽 눈을 보십시오. 이것이야 말로 증거가 아니겠습니까?ㄷ",
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
  TEST_APPLIED_APPLICATION,
  {
    id: generateId(),
    sospesoId: generateId(),
    to: "퀴어 문화 축제 올 사람",
    status: "rejected",
    appliedAt: new Date(TEST_NOW.valueOf() - 1000 * 60 * 60 * 24),
    applicant: {
      id: generateId(),
      nickname: "혐오자",
    },
    content: "저는 소스페소에 이상한 요청을 보낸 나쁜 사람입니다",
  },
  TEST_APPROVED_APPLICATION,
];

export const 김태희_코치 = { id: "f1VCrUCPV62mNI", name: "김태희" };

export const TEST_COACH_LIST = [
  김태희_코치,
  { id: "33EeO_yWM00LvM", name: "김태형" },
  { id: "xTAEl4sxg-NwX-", name: "이시은" },
];

const TEST_TO_LIST = [
  "시각 장애인인 사람",
  "청각 장애인인 사람",
  "1년 넘게 구직 중인 사람",
  "퀴어 문화 축제 올 사람",
  "정의론을 읽은 사람",
  "결혼 이민자",
  "탈북자",
  "학교를 다니지 않는 청소년",
  "결혼하지 않고 아이를 양육하고 계신 분",
  "성매매 피해 여성 쉼터에서 일자리를 찾고 계신 분",
  "교정 시설을 나오신 분",
  "다문화 가정 청소년",
  "이주 노동자",
  "노숙자",
  "성소수자 운동 단체에서 일하고 계신 분",
  "산재를 입으신 분",
  "수어를 배우신 분",
];

export function pick<T>(candidates: T[]): T {
  const result = candidates[Math.floor(Math.random() * candidates.length)];
  invariant(result, "candidates가 비어 있습니다!");

  return result;
}

const faker = new Faker({ locale: [ko] });

export function randomSospeso(status: SospesoStatus = "issued"): Sospeso {
  // id: string;
  // from: string;
  // to: string; // <- 수혜자 조건
  // issuing: SospesoIssuing;
  // applicationList: SospesoApplication[];
  // consuming: SospesoConsuming | undefined;
  return {
    id: generateId(),
    from: faker.person.fullName(),
    to: pick(TEST_TO_LIST),
    issuing: {
      id: generateId(),
      paidAmount: 80000,
      issuerId: TEST_USER_ID,
      issuedAt: faker.date.between({
        from: new Date("2024-11-01T00:00:00Z"),
        to: new Date(),
      }),
    },
    applicationList:
      status === "issued"
        ? []
        : status === "pending"
          ? [
              {
                id: generateId(),
                status: "rejected",
                content: "",
                applicantId: TEST_USER_ID,
                appliedAt: new Date(),
              },
              {
                id: generateId(),
                status: "applied",
                content: "",
                applicantId: TEST_USER_ID,
                appliedAt: new Date(),
              },
            ]
          : [
              {
                id: generateId(),
                status: "approved",
                content: "",
                applicantId: TEST_USER_ID,
                appliedAt: new Date(),
              },
            ],
    consuming:
      status === "consumed"
        ? {
            id: generateId(),
            content: "너무 좋았어요",
            memo: "",
            consumerId: TEST_USER_ID,
            coachId: TEST_ADMIN_USER_ID,
            consumedAt: new Date(),
          }
        : undefined,
  };
}
