import { type ComponentProps } from "react";
import { TextField } from "./TextField";

export function PasswordInput(
  props: Omit<
    ComponentProps<typeof TextField>,
    "type" | "minLength" | "maxLength"
  >,
) {
  // https://www.better-auth.com/docs/authentication/email-password
  // better-auth가 최대 32자가 기본 값임
  return <TextField {...props} type="password" minLength={10} maxLength={32} />;
}
