import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import preact from "@astrojs/preact";
import { loadEnv } from "vite";
import netlify from "@astrojs/netlify";
const { PUBLIC_CONTACT_FORM_KEY, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } =
  loadEnv(process.env.NODE_ENV, process.cwd(), "");
[PUBLIC_CONTACT_FORM_KEY, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID].forEach(
  (item) => {
    if (!item) throw new Error(`${item} env var not set!`);
  },
);

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    mdx(),
    preact({
      compat: true,
    }),
  ],
  output: "hybrid",
  adapter: netlify({
    edgeMiddleware: true
  }),
  redirects: {
    "/about": "/#section-bio",
    "/music": "/",
    "/services/teaching-organ": "/#section-teaching",
    "/services/teaching-piano": "/#section-teaching",
    "/services/teaching-": "/#section-teaching",
    "/teaching-music-theory-and-musicianship": "/#section-teaching",
    "/contact": "/#section-contact",
  },
});
