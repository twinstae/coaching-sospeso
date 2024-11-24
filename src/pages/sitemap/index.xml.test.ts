import { describe, expect, test } from "vitest";
import {
  GET,
  HOME_PRIORITY,
  SOSPESO_DETAIL_PRIORITY,
  TERMS_PRIORITY,
} from "./index.xml";
import { href } from "@/routing/href";
import { routes } from "@/routing/routes";
import { env } from "@/adapters/env";

describe("sitemap", () => {
  test("sitemap XML을 생성할 수 있다", async () => {
    const siteUrl = env.APP_HOST;
    const expectedStaticUrls = [
      { url: routes["홈"].path, priority: HOME_PRIORITY },
      { url: routes["개인정보처리방침"].path, priority: TERMS_PRIORITY },
      { url: routes["이용약관"].path, priority: TERMS_PRIORITY },
    ];

    const mockApplications = [
      { sospesoId: crypto.randomUUID() },
      { sospesoId: crypto.randomUUID() },
    ];

    const response = await GET({} as any);
    const sitemapXml = await response.text();

    // Content-Type 확인
    expect(response.headers.get("Content-Type")).toBe(
      "application/xml; charset=utf-8",
    );

    // 정적 페이지 URL 확인
    expectedStaticUrls.forEach(({ url, priority }) => {
      expect(sitemapXml).toContain(`<loc>${siteUrl}${url}</loc>`);
      expect(sitemapXml).toContain(`<priority>${priority}</priority>`);
    });

    // 소스페소 상세 페이지 URL 확인
    mockApplications.forEach(({ sospesoId }) => {
      const sospesoUrl = new URL(href("소스페소-상세", { sospesoId }), siteUrl)
        .href;
      expect(sitemapXml).toContain(`<loc>${sospesoUrl}</loc>`);
      expect(sitemapXml).toContain(
        `<priority>${SOSPESO_DETAIL_PRIORITY}</priority>`,
      );
    });
  });
});
