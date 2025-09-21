import { Template, type TemplateProps } from "@/shared/email/SecretLink";
import { render } from "jsx-email";

export async function renderSecretLinkEmail(props: TemplateProps) {
  return render(<Template {...props} />);
}
