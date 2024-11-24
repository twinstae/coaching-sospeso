import { sospesoRepo } from "@/actions/actions";
import { env } from "@/adapters/env";
import { href } from "@/routing/href";
import { routes } from "@/routing/routes";
import type { APIRoute } from "astro";

export const HOME_PRIORITY = 1;
export const TERMS_PRIORITY = 0.6;
export const SOSPESO_DETAIL_PRIORITY = 0.8;
export const STATIC_PAGES = [
  { url: routes["홈"].path, priority: HOME_PRIORITY },
  { url: routes["개인정보처리방침"].path, priority: TERMS_PRIORITY },
  { url: routes["이용약관"].path, priority: TERMS_PRIORITY },
];

const makeSitemapUrls = (sitemapData: { url: string; priority: number }[]) =>
  sitemapData
    .map(
      (sitemap) => `
    <url>
      <loc>${new URL(encodeURI(sitemap.url), env.APP_HOST).href}</loc>
      <priority>${sitemap.priority}</priority>
    </url>
  `,
    )
    .join("");

// 소스페소 상세 페이지 우선순위 0.8, sitemapData 로 변환하는 함수
const makeSitemapData = (sospesoList: { sospesoId: string }[]) =>
  sospesoList.map((sospeso) => ({
    url: href("소스페소-상세", { sospesoId: sospeso.sospesoId }),
    priority: SOSPESO_DETAIL_PRIORITY,
  }));

export const GET: APIRoute = async () => {
  const applicationList = await sospesoRepo.retrieveApplicationList();

  const sospesoSitemapData = makeSitemapData(applicationList);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${makeSitemapUrls(STATIC_PAGES)}
    ${makeSitemapUrls(sospesoSitemapData)}
  </urlset>`;

  return new Response(sitemap, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
