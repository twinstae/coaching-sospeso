import { describe, expect, test } from "vitest";
import {
  createSitemapHandler,
  HOME_PRIORITY,
  SOSPESO_DETAIL_PRIORITY,
  TERMS_PRIORITY,
} from "./index.xml";
import { href } from "@/routing/href";
import { routes } from "@/routing/routes";
import { secretEnv } from "@/adapters/env.secret";
import { createFakeSospesoRepository } from "@/sospeso/repository";
import { randomSospeso } from "@/sospeso/fixtures";

describe("sitemap", () => {
  test("sitemap XML을 생성할 수 있다", async () => {
    const siteUrl = secretEnv.APP_HOST;
    const expectedStaticUrls = [
      { url: routes["홈"].path, priority: HOME_PRIORITY },
      { url: routes["개인정보처리방침"].path, priority: TERMS_PRIORITY },
      { url: routes["이용약관"].path, priority: TERMS_PRIORITY },
    ];

    const TEST_SOSPESO = {
      ...randomSospeso("pending"),
      id: "MCmsmrc3U8rMrf",
    };
    const handler = createSitemapHandler(
      createFakeSospesoRepository({
        [TEST_SOSPESO.id]: TEST_SOSPESO,
      }),
    );

    const response = await handler({} as any);
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

    expect(sitemapXml).toContain(
      `<loc>http://localhost:4321${href("소스페소-상세", { sospesoId: TEST_SOSPESO.id })}</loc>`,
    );
    expect(sitemapXml).toContain(
      `<priority>${SOSPESO_DETAIL_PRIORITY}</priority>`,
    );

    expect(sitemapXml).toMatchInlineSnapshot(`
      "<?xml version="1.0" encoding="UTF-8"?>
          <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            
          <url>
            <loc>http://localhost:4321/</loc>
            <priority>1</priority>
          </url>
        
          <url>
            <loc>http://localhost:4321/terms/privacy</loc>
            <priority>0.6</priority>
          </url>
        
          <url>
            <loc>http://localhost:4321/terms/usage</loc>
            <priority>0.6</priority>
          </url>
        
            
          <url>
            <loc>http://localhost:4321/sospeso/MCmsmrc3U8rMrf</loc>
            <priority>0.8</priority>
          </url>
        
          </urlset>"
    `);
  });
});
