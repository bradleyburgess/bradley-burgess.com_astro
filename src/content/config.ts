import { z, defineCollection } from "astro:content";

const videoTrackCollection = defineCollection({
  type: "content",
  schema: z.object({
    composer: z.string(),
    date: z.string().optional(),
    live: z.boolean().optional(),
    location: z.string().optional(),
    tags: z.array(z.string()),
    title: z.string(),
    type: z.union([z.literal("youtube"), z.literal("audio")]),
    url: z.string(),
  }),
});

const audioTrackCollection = defineCollection({
  type: "content",
  schema: z.object({
    composer: z.string(),
    date: z.string().optional(),
    live: z.boolean().optional(),
    location: z.string().optional(),
    tags: z.array(z.string()),
    title: z.string(),
    type: z.union([z.literal("youtube"), z.literal("audio")]),
    url: z.string(),
  }),
});

const pagePartialCollection = defineCollection({
  type: "content",
  schema: z.object({
    cta: z
      .object({
        text: z.string(),
        href: z.string(),
      })
      .optional(),
  }),
});

export const collections = {
  "audio-tracks": audioTrackCollection,
  "video-tracks": videoTrackCollection,
  "page-partials": pagePartialCollection,
};
