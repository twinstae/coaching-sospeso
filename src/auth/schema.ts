import * as v from "valibot";

export const emailSchema = v.pipe(
  v.string(),
  v.minLength(1, "이메일이 없어요"),
  v.email("올바른 이메일 형식이 아니에요"),
);

export const passwordSchema = v.pipe(
  v.string(),
  v.minLength(10, "최소 10자리 이상이어야해요"),
  v.regex(/[0-9]/i, "숫자를 적어도 하나 이상 포함해야해요"),
  v.regex(/[a-zA-Z]/i, "영문자를 적어도 하나 이상 포함해야해요"),
  // v.regex(/[\W_]/i, "특수문자를 적어도 하나 이상 포함해야해요"),
)

export const phoneSchema = v.pipe(
  v.string(),
  v.regex(
    /[0-9]{3}-[0-9]{4}-[0-9]{4}/,
    "010-1234-5678 같은 휴대폰 번호를 입력해주세요",
  ),
)