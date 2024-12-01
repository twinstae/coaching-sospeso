// 글자수 제한 중요!
export type Role = "admin" | "user";

export type User = {
  id: string;
  name: string;
  role: Role;
  nickname: string;
  phone: string;
  email: string;
  emailVerified: boolean;
  image: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminUser = User & { role: "admin" };

export function isAdmin(user: { role: User["role"] }): user is AdminUser {
  return user.role === "admin";
}
