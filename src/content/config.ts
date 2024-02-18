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
  schema: ({ image }) =>
    z.object({
      cta: z
        .array(
          z.object({
            text: z.string(),
            href: z.string(),
          }),
        )
        .optional(),
      image: z
        .object({
          src: image(),
          alt: z.string(),
        })
        .optional(),
    }),
});

const testimonialCollection = defineCollection({
  type: "data",
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      lessonType: z.string(),
      body: z.string(),
      image: image().refine((img) => img.height === img.width, {
        message: "Image must be square.",
      }),
    }),
});

export const collections = {
  "audio-tracks": audioTrackCollection,
  "video-tracks": videoTrackCollection,
  "page-partials": pagePartialCollection,
  testimonials: testimonialCollection,
};
