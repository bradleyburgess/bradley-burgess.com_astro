import type { Ref } from "preact";
import LoadingSpinner from "react-spinners/ScaleLoader";
import { forwardRef, type ChangeEvent, type ReactNode } from "preact/compat";
import { useRef, useState } from "preact/hooks";
import { useEffect } from "react";
import Video from "./Video";

const isNotEmpty = (input: string) => input.length > 0;
const isLessThan = (length: number) => (input: string) => input.length < length;
const isValidEmail = (input: string) =>
  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(input);

interface IValidators {
  name: {
    test: (input: string) => boolean;
    errorMsg: string;
  }[];
  email: {
    test: (input: string) => boolean;
    errorMsg: string;
  }[];
  subject: {
    test: (input: string) => boolean;
    errorMsg: string;
  }[];
  message: {
    test: (input: string) => boolean;
    errorMsg: string;
  }[];
}

type TFormField = "name" | "email" | "subject" | "message";

const validators: IValidators = {
  name: [
    { test: isNotEmpty, errorMsg: "Name can't be empty" },
    { test: isLessThan(50), errorMsg: "Name must be less than 50 characters" },
  ],
  email: [{ test: isValidEmail, errorMsg: "Must be a valid email address" }],
  subject: [
    { test: isNotEmpty, errorMsg: "Subject can't be empty" },
    {
      test: isLessThan(50),
      errorMsg: "Subject must be less than 50 characters",
    },
  ],
  message: [
    { test: isNotEmpty, errorMsg: "Message can't be empty" },
    {
      test: isLessThan(1000),
      errorMsg: "Please enter a message less than 1000 characters",
    },
  ],
};

const blankFormErrors = { name: "", email: "", subject: "", message: "" };

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
  const [formErrors, setFormErrors] = useState({
    name: "",
    subject: "",
    email: "",
    message: "",
  });
  const [waiting, setWaiting] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const questionRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHasJavascript(true);
  }, []);

  function handleFormChange(e: ChangeEvent) {
    const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement;
    let error = false;
    for (let item of validators[name as TFormField]) {
      if (!item.test(value)) {
        setFormErrors((state) => ({ ...state, [name]: item.errorMsg }));
        error = true;
        break;
      }
    }
    if (!error) setFormErrors((state) => ({ ...state, [name]: "" }));
    setFormState((state) => ({ ...state, [name]: value }));
  }

  async function handleFormSubmit(e: SubmitEvent) {
    e.preventDefault();
    let errors = false;
    for (let key in validators) {
      for (let item of validators[key as TFormField]) {
        const result = item.test(formState[key as TFormField]);
        if (!result) {
          setFormErrors((state) => ({ ...state, [key]: item.errorMsg }));
          errors = true;
          break;
        }
      }
    }

    if (errors) return;
    setFormErrors({ ...blankFormErrors });

    setSubmitted(true);
    setWaiting(true);
    document.querySelector("#section-contact")?.scrollIntoView();
    const honeypot = questionRef.current?.value;
    const result = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...formState, honeypot }),
    });
    const data = await result.json();
    const success = data.success;
    if (success) {
      setError(false);
      setTimeout(() => {
        setWaiting(false);
      }, 1000);
      return;
    }
    setError(true);
    setTimeout(() => {
      setWaiting(false);
    }, 1000);
  }

  function successButtonClickHander() {
    setSubmitted(false);
    setFormState((state) => ({ ...state, message: "", subject: "" }));
    setError(null);
    setFormErrors({ ...blankFormErrors });
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
      <Label htmlFor="name" error={formErrors.name}>
        <Input
          type="text"
          name="name"
          onChange={handleFormChange}
          value={formState.name}
          ref={nameRef}
          placeholder="Johann Sebastian Bach"
        />
      </Label>
      <Label htmlFor="email" error={formErrors.email}>
        <Input
          type="email"
          name="email"
          onChange={handleFormChange}
          value={formState.email}
          placeholder="jsbach@stthomasleipzig.org"
        />
      </Label>
      <Label htmlFor="subject" error={formErrors.subject}>
        <Input
          type="text"
          name="subject"
          onChange={handleFormChange}
          value={formState.subject}
          placeholder="How can I help you?"
        />
      </Label>
      <Label
        htmlFor="message"
        stack={true}
        error={formErrors.message}
        charCount={formState.message.length}
        maxCharCount={1000}
      >
        <Textarea
          name="message"
          onChange={handleFormChange}
          value={formState.message}
          placeholder="Enter your message, max 1000 characters"
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
          placeholder="Enter your message, max 1000 characters"
        />
      </label>
      <Submit
        value="Submit"
        disabled={
          !!formErrors.name ||
          !!formErrors.email ||
          !!formErrors.subject ||
          !!formErrors.message
        }
      />
    </form>
  );
};

type ReactChildren = ReactNode | ReactNode[];

interface ILabelProps {
  children: ReactChildren;
  htmlFor: string;
  stack?: boolean;
  error?: string;
  charCount?: number;
  maxCharCount?: number;
}

const Label = ({
  error,
  charCount,
  maxCharCount,
  children,
  htmlFor,
  stack,
}: ILabelProps) => (
  <div>
    <label
      htmlFor={htmlFor}
      className={`flex gap-x-4 gap-y-2 ${stack ? "flex-col justify-center" : "items-center"} ${error ? "[&_input]:border-red-500 [&_input]:bg-red-950 [&_input]:text-red-100 [&_textarea]:border-red-500 [&_textarea]:bg-red-950 [&_textarea]:text-red-100" : ""}`}
    >
      <span
        className={`${stack ? "flex w-full items-end justify-between" : "inline-block w-[--labelLength]"} font-alternate ${error ? "text-red-400" : ""}`}
      >
        {charCount === undefined ? (
          <span>{labelize(htmlFor)}</span>
        ) : (
          <>
            <span>{labelize(htmlFor)}</span>
            <span className="pr-1 text-xs font-extralight">
              ({charCount}/{maxCharCount})
            </span>
          </>
        )}
      </span>
      {children}
    </label>
    {error && <ErrorMsg msg={error} />}
  </div>
);

interface IErrorMsgProps {
  msg?: string;
}
const ErrorMsg = ({ msg }: IErrorMsgProps) => (
  <span className="inline-block w-full text-right font-semibold text-red-500">
    {msg ?? ""}
  </span>
);

interface IInputProps {
  type: "text" | "email" | "textarea";
  name: string;
  onChange: (e: ChangeEvent) => void;
  value: string;
  placeholder?: string;
}

const Input = forwardRef(
  (
    { type, name, onChange, value, placeholder }: IInputProps,
    ref: Ref<HTMLInputElement>,
  ) => (
    <input
      type={type}
      name={name}
      id={name}
      onChange={onChange}
      value={value}
      className="flex-1 rounded-2xl bg-gray-900 transition-colors duration-100 focus-within:border-gray-300 focus-within:bg-gray-800 focus-within:shadow-gray-300 focus-within:outline-0 hover:bg-gray-800 focus:border-gray-300 focus:bg-gray-800 focus:shadow-gray-300 focus:outline-0"
      ref={ref}
      placeholder={placeholder}
    />
  ),
);

interface ITextareaProps {
  name: string;
  onChange: (e: ChangeEvent) => void;
  value: string;
  placeholder?: string;
}

const Textarea = ({ placeholder, name, onChange, value }: ITextareaProps) => (
  <textarea
    name={name}
    id={name}
    onChange={onChange}
    value={value}
    cols={30}
    rows={10}
    className="resize-none rounded-2xl bg-gray-900 transition-colors duration-100 focus-within:border-gray-300 focus-within:bg-gray-800 focus-within:shadow-gray-300 focus-within:outline-0 hover:bg-gray-800 focus:border-gray-300 focus:bg-gray-800 focus:shadow-gray-300 focus:outline-0"
    placeholder={placeholder}
  ></textarea>
);

interface ISubmitProps {
  value: string;
  disabled: boolean;
}

const Submit = ({ value, disabled }: ISubmitProps) => (
  <input
    type="submit"
    value={value}
    className="cursor-pointer rounded-2xl bg-gray-800 py-2 transition-colors duration-100 hover:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-500 disabled:hover:bg-gray-800"
    disabled={disabled}
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
        message was sent. I'll be in touch soon.
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
