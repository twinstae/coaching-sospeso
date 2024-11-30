import { defineCollection, z } from "astro:content";

import { fakeContentApi, outlineContentApi } from "@/adapters/contentApi";
import { isProd } from "@/adapters/env";
const contentApi = isProd ? outlineContentApi : fakeContentApi;

const coaches = defineCollection({
  loader: async () => {
    const profileMarkdown = await contentApi.getCoachProfilePage();

    return [
      {
        id: "coaches",
        content: profileMarkdown,
      },
    ];
  },
  schema: z.object({
    content: z.string(),
  }),
});

export const collections = { coaches };
