import { sospesoRepo } from "@/actions/actions";
import { secretEnv } from "@/adapters/env.secret";
import { href } from "@/routing/href";
import { routes } from "@/routing/routes";
import type { SospesoRepositoryI } from "@/sospeso/repository";
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
      <loc>${new URL(encodeURI(sitemap.url), secretEnv.APP_HOST).href}</loc>
      <priority>${sitemap.priority}</priority>
    </url>
  `,
    )
    .join("");

// 소스페소 상세 페이지 우선순위 0.8, sitemapData 로 변환하는 함수
const makeSitemapData = (sospesoList: { id: string }[]) =>
  sospesoList.map((sospeso) => ({
    url: href("소스페소-상세", { sospesoId: sospeso.id }),
    priority: SOSPESO_DETAIL_PRIORITY,
  }));

export function createSitemapHandler(
  sospesoRepo: SospesoRepositoryI,
): APIRoute {
  return async () => {
    const { sospesoList } = await sospesoRepo.retrieveSospesoList({
      page: 1,
      status: undefined,
      limit: 9999,
    });

    const sospesoSitemapData = makeSitemapData(sospesoList);

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${makeSitemapUrls(STATIC_PAGES)}
      ${makeSitemapUrls(sospesoSitemapData)}
    </urlset>`;

    return new Response(sitemap, {
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
  };
}

export const GET: APIRoute = createSitemapHandler(sospesoRepo);
