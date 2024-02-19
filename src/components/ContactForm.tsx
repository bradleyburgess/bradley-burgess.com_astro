import type { Ref } from "preact";
import LoadingSpinner from "react-spinners/ScaleLoader";
import { forwardRef, type ChangeEvent, type ReactNode } from "preact/compat";
import { useRef, useState } from "preact/hooks";
import { useEffect } from "react";
import Video from "./Video";

interface IFormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactForm = () => {
  const [formState, setFormState] = useState<IFormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [hasJavascript, setHasJavascript] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<boolean | null>();
  const [waiting, setWaiting] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const questionRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHasJavascript(true);
  }, []);

  function handleFormChange(e: ChangeEvent) {
    const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement;
    setFormState((state) => ({ ...state, [name]: value }));
  }

  async function handleFormSubmit(e: SubmitEvent) {
    e.preventDefault();
    setSubmitted(true);
    setWaiting(true);
    const honeypot = questionRef.current?.value;
    const result = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...formState, honeypot }),
    });
    const data = await result.json();
    console.log(data);
    const success = data.success;
    if (success) {
      setError(false);
      setSubmitted(true);
      setTimeout(() => {
        setWaiting(false);
      }, 1000);
      return;
    }
    setSubmitted(true);
    setError(true);
    setTimeout(() => {
      setWaiting(false);
    }, 1000);
  }

  function successButtonClickHander() {
    setSubmitted(false);
    setFormState((state) => ({ ...state, message: "", subject: "" }));
    setError(null);
  }

  function errorButtonClickHandler() {
    setSubmitted(false);
    setError(null);
  }

  function handleContactSubjectEvent(e: CustomEvent) {
    setFormState((state) => ({ ...state, subject: e.detail }));
    setTimeout(() => {
      nameRef.current?.focus();
    }, 100);
  }

  useEffect(() => {
    const subject = new URLSearchParams(window.location.search).get("subject");
    if (subject) setFormState((state) => ({ ...state, subject }));
  });

  useEffect(() => {
    window.addEventListener(
      "contactsubject",
      handleContactSubjectEvent as EventListener,
    );
    return () =>
      window.removeEventListener(
        "contactsubject",
        handleContactSubjectEvent as EventListener,
      );
  }, []);

  useEffect(() => {
    const subject = new URLSearchParams(window.location.search).get("subject");
    if (subject) {
      setFormState((state) => ({ ...state, subject }));
    }
  }, []);

  return submitted && waiting ? (
    <div className="mt-10 flex justify-center">
      <div className="flex flex-col items-center gap-4 rounded-3xl bg-gray-800 px-10 py-8">
        {/* @ts-ignore-next-line */}
        <LoadingSpinner size={20} loading={true} color="#d1d5db" />
        <p>Submitting request …</p>
      </div>
    </div>
  ) : submitted && !error ? (
    <ContactSuccess buttonClickHandler={successButtonClickHander} />
  ) : submitted && error ? (
    <ContactError buttonClickHandler={errorButtonClickHandler} />
  ) : (
    <form
      method="post"
      onSubmit={handleFormSubmit}
      className="flex flex-col gap-5"
      style={{ "--labelLength": "5rem" }}
    >
      <Label htmlFor="name">
        <Input
          type="text"
          name="name"
          onChange={handleFormChange}
          value={formState.name}
          required
          ref={nameRef}
        />
      </Label>
      <Label htmlFor="email">
        <Input
          type="email"
          name="email"
          onChange={handleFormChange}
          value={formState.email}
          required
        />
      </Label>
      <Label htmlFor="subject">
        <Input
          type="text"
          name="subject"
          onChange={handleFormChange}
          value={formState.subject}
          required
        />
      </Label>
      <Label htmlFor="message" stack={true}>
        <Textarea
          name="message"
          onChange={handleFormChange}
          value={formState.message}
          required
        ></Textarea>
      </Label>
      <label htmlFor="question" className="sr-only">
        Leave this unchanged:{" "}
        <input
          type="text"
          name="question"
          id="question"
          className="sr-only"
          value={import.meta.env.PUBLIC_CONTACT_FORM_KEY ?? ""}
          ref={questionRef}
        />
      </label>
      <Submit value="Submit" />
    </form>
  );
};

type ReactChildren = ReactNode | ReactNode[];

interface ILabelProps {
  children: ReactChildren;
  htmlFor: string;
  stack?: boolean;
}

const Label = ({ children, htmlFor, stack }: ILabelProps) => (
  <label
    htmlFor={htmlFor}
    className={`flex gap-x-4 gap-y-2 ${stack ? "flex-col justify-center" : "items-center"}`}
  >
    <span className="inline-block w-[--labelLength]">{labelize(htmlFor)}</span>
    {children}
  </label>
);

interface IInputProps {
  type: "text" | "email" | "textarea";
  name: string;
  onChange: (e: ChangeEvent) => void;
  value: string;
  required?: boolean;
}

const Input = forwardRef(
  (
    { required, type, name, onChange, value }: IInputProps,
    ref: Ref<HTMLInputElement>,
  ) => (
    <input
      type={type}
      name={name}
      id={name}
      onChange={onChange}
      value={value}
      className="flex-1 rounded-2xl bg-gray-900 transition-colors duration-100 focus-within:border-gray-300 focus-within:bg-gray-800 focus-within:shadow-gray-300 focus-within:outline-0 hover:bg-gray-800 focus:border-gray-300 focus:bg-gray-800 focus:shadow-gray-300 focus:outline-0"
      required={required}
      ref={ref}
    />
  ),
);

interface ITextareaProps {
  name: string;
  onChange: (e: ChangeEvent) => void;
  value: string;
  required?: boolean;
}

const Textarea = ({ required, name, onChange, value }: ITextareaProps) => (
  <textarea
    name={name}
    id={name}
    onChange={onChange}
    value={value}
    cols={30}
    rows={10}
    className="resize-none rounded-2xl bg-gray-900 transition-colors duration-100 focus-within:border-gray-300 focus-within:bg-gray-800 focus-within:shadow-gray-300 focus-within:outline-0 hover:bg-gray-800 focus:border-gray-300 focus:bg-gray-800 focus:shadow-gray-300 focus:outline-0"
    required={required}
  ></textarea>
);

interface ISubmitProps {
  value: string;
}

const Submit = ({ value }: ISubmitProps) => (
  <input
    type="submit"
    value={value}
    className="cursor-pointer rounded-2xl bg-gray-800 py-2 transition-colors duration-100 hover:bg-gray-700"
  />
);

const labelize = (text: string): string =>
  text
    .split("")
    .reduce((a, c, i) => (i === 0 ? a + c.toUpperCase() : a + c), "") + ": ";

const Button = ({ buttonClickHandler }: IContactSuccessProps) => (
  <button
    className="w-full rounded-2xl bg-gray-900 p-2 px-10 transition-colors duration-100 hover:bg-gray-800"
    onClick={buttonClickHandler}
  >
    Send another message.
  </button>
);

interface IContactSuccessProps {
  buttonClickHandler?: (e: MouseEvent) => void;
}
const ContactSuccess = ({ buttonClickHandler }: IContactSuccessProps) => {
  return (
    <div className="prose prose-gray prose-invert">
      <p>
        <span className="font-semibold text-green-600">Success!</span> Your
        email was sent. I'll be in touch soon.
      </p>
      <button
        className="w-full rounded-2xl bg-gray-900 p-2 px-10 transition-colors duration-100 hover:bg-gray-800"
        onClick={buttonClickHandler}
      >
        Send another message.
      </button>
      <Video
        src="/video/thank-you2.mp4"
        subtitlesSrc="/video/thank-you2.vtt"
        height={640}
        width={640}
      />
    </div>
  );
};

const ContactError = ({ buttonClickHandler }: IContactSuccessProps) => {
  return (
    <div className="prose prose-gray prose-invert">
      <p class="text-red-500">
        <span className="font-bold text-red-500">Yikes!</span> It seems there
        was an error.
      </p>
      <button
        className="w-full rounded-2xl bg-gray-900 p-2 px-10 transition-colors duration-100 hover:bg-gray-800"
        onClick={buttonClickHandler}
      >
        Try sending again.
      </button>
      <Video
        src="/video/david.mp4"
        subtitlesSrc="/video/david.vtt"
        height={632}
        width={640}
      />
    </div>
  );
};

export default ContactForm;
