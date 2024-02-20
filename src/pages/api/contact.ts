import type { APIRoute } from "astro";
import { DateTime } from "luxon";

export const prerender = false;

const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = import.meta.env;

interface ITelegramMessageProps {
  formName: string;
  formEmail: string;
  formSubject: string;
  formMessage: string;
}

const createMessage = ({
  formName,
  formEmail,
  formSubject,
  formMessage,
}: ITelegramMessageProps) =>
  `New message through bradley-burgess.com

Name: ${formName}
Date: ${DateTime.now().setZone("America/New_York").toLocaleString(DateTime.DATETIME_MED)}
Email: ${formEmail}
Subject: ${formSubject}

Message: ${formMessage}`;

const sendTelegramMessage = async ({
  formName,
  formEmail,
  formSubject,
  formMessage,
}: ITelegramMessageProps) => {
  const result = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: createMessage({ formName, formEmail, formSubject, formMessage }),
      }),
    },
  );
  return result;
};

interface ILogProps {
  formEmail: string;
  formName: string;
  formSubject: string;
}

const log = ({ formEmail, formName, formSubject }: ILogProps) =>
  console.log(
    `${DateTime.now().setZone("America/New_York").toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}: New Message from ${formName} (${formEmail}) with subject ${formSubject})`,
  );

export const POST: APIRoute = async ({ request, params }) => {
  const honeypotKey = import.meta.env.PUBLIC_CONTACT_FORM_KEY;
  const data = await request.json();
  const formName = data.name;
  const formEmail = data.email;
  const formSubject = data.subject;
  const formMessage = data.message;
  const formHoneypot = data.honeypot;

  if (formHoneypot != honeypotKey) {
    return new Response(
      JSON.stringify({ success: false, message: "Honeypot Key changed!" }),
    );
  }

  log({ formEmail, formSubject, formName });
  const result = await sendTelegramMessage({
    formName,
    formEmail,
    formSubject,
    formMessage,
  });
  if (result.status === 200) {
    return new Response(JSON.stringify({ success: true }));
  }
  return new Response(JSON.stringify({ success: false }));
};
