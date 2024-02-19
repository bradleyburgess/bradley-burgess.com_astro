import type { APIRoute } from "astro";

export const prerender = false;

const getSuccess = () => (Math.random() > 0.5 ? true : false);

export const POST: APIRoute = async ({ request, params }) => {
  const honeypotKey = import.meta.env.PUBLIC_CONTACT_FORM_KEY;
  const data = await request.json();
  if (data.honeypot != honeypotKey) {
    return new Response(
      JSON.stringify({ success: false, message: "Honeypot Key changed!" }),
    );
  }
  return new Response(JSON.stringify({ success: true }));
};
