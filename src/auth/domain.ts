// 글자수 제한 중요!
export type User = {
  id: string;
  name: string;
  nickname: string;
  email: string;
  emailVerified: boolean;
  image: string;
  createdAt: Date;
  updatedAt: Date;
};
