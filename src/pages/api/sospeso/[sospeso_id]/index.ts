import type { APIRoute } from 'astro'

// 소스페소 승인과 거절

export const PATCH: APIRoute = ({ request }) => {
    return new Response(JSON.stringify({
        message: "This was a POST!"
    })
    )
}