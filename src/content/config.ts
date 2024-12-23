import { defineCollection, z } from "astro:content";

import { fakeContentApi, ghostContentApi } from "@/adapters/contentApi.ts";
import { isProd } from "@/adapters/env.public.ts";

const contentApi = isProd ? ghostContentApi : fakeContentApi;

const coaches = defineCollection({
  loader: async () => {
    const profileHTML = await contentApi.getCoachProfilePage();

    return [
      {
        id: "coaches",
        content: profileHTML,
      },
    ];
  },
  schema: z.object({
    content: z.string(),
  }),
});

export const collections = { coaches };
