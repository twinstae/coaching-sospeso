"use server";

import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "jsx-email";

export interface TemplateProps {
  title: string;
  description: string;
  cta: {
    href: string;
    text: string;
  };
}

const colors = {
  primary: "#0a0a0a",
  primaryContent: "#fff",
  baseContent: "#000",
};

const sizing = {
  roundedBtn: 2,
};

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  marginTop: "16px",
  marginBottom: "64px",
  padding: "20px 0 48px",
};

const box = {
  padding: "0 48px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const typography = {
  title: {
    color: colors.baseContent,
    fontWeight: 700,
    fontSize: "24px",
    lineHeight: "36px",
    textAlign: "left" as const,
  },
  paragraph: {
    color: colors.baseContent,
    fontSize: "16px",
    lineHeight: "24px",
    textAlign: "left" as const,
  },
};

const anchor = {
  color: colors.baseContent,
  textDecoration: "underline",
};

const button = {
  fontWeight: "bold",
  padding: "0",
  textDecoration: "none",
};

export const previewProps: TemplateProps = {
  title: "김태희 님 어서오세요☕",
  description: "코칭 소스페소 가입을 완료하려면, 아래 링크를 클릭해주세요.",
  cta: {
    href: "https://coaching-sospeso.org",
    text: "이메일 인증하기",
  },
};

export const templateName = "SecretLink";

export const Template = ({ title, description, cta }: TemplateProps) => (
  <Html lang="ko">
    <Head />
    <Preview>
      {title} : {description}
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Text style={typography.title}>{title}</Text>
          <Text style={typography.paragraph}>{description}</Text>
          <Button
            backgroundColor={colors.primary}
            textColor={colors.primaryContent}
            borderRadius={sizing.roundedBtn}
            fontSize={14}
            height={48}
            href={cta.href}
            style={button}
            width={160}
          >
            {cta.text}
          </Button>
          <Hr style={hr} />
          <Text style={typography.paragraph}>
            <Link style={anchor} href="https://cocaching-sospeso.org">
              코칭 소스페소
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);
