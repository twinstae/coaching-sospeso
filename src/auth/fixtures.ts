import { generateNanoId } from "@/adapters/generateId";
import type { User } from "./domain";

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
  role: "user",
  phone: "010-1234-5678",
} satisfies User;

export const TEST_ADMIN_USER_ID = generateNanoId();
export const TEST_ADMIN_USER = {
  id: TEST_ADMIN_USER_ID,
  name: "김태희",
  nickname: "김코치",
  email: TEST_ADMIN_USER_ID + "@test.kr",
  emailVerified: true,
  image: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  role: "admin",
  phone: "010-1234-5678",
} satisfies User;
