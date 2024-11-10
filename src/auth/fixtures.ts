import { generateNanoId } from "@/adapters/generateId";

export const TEST_USER_ID = generateNanoId();
export const TEST_USER = {
  id: TEST_USER_ID,
  name: "김래빗",
  nickname: "김토끼",
  email: TEST_USER_ID + "@test.kr",
  emailVerified: true,
  image: "",
  createdAt: new Date(),
  updatedAt: new Date(),
};
