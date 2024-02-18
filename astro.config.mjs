import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import preact from "@astrojs/preact";
import { loadEnv } from "vite";

const { PUBLIC_CONTACT_FORM_KEY } = loadEnv(
  process.env.NODE_ENV,
  process.cwd(),
  "",
);

if (!PUBLIC_CONTACT_FORM_KEY)
  throw new Error("Contact Form Key (`PUBLIC_CONTACT_FORM_KEY`) not set!");

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    mdx(),
    preact({ compat: true }),
  ],
});
