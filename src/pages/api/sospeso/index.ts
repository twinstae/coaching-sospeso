import type { APIRoute } from "astro";

// 소스페소 관리자용 목록
export const GET: APIRoute = ({ params, request }) => {
  console.log(params, request.headers)
  return new Response(JSON.stringify({}));
};
