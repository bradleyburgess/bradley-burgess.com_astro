import type { Ref } from "preact";
import { forwardRef, type ChangeEvent, type ReactNode } from "preact/compat";
import { useRef, useState } from "preact/hooks";
import { useEffect } from "react";

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
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHasJavascript(true);
  }, []);

  function handleFormChange(e: ChangeEvent) {
    const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement;
    setFormState((state) => ({ ...state, [name]: value }));
  }

  function handleFormSubmit(e: SubmitEvent) {
    e.preventDefault();
    console.log(formState);
  }

  useEffect(() => {
    const subject = new URLSearchParams(window.location.search).get("subject");
    if (subject) setFormState((state) => ({ ...state, subject }));
  });

  function handleContactSubjectEvent(e: CustomEvent) {
    setFormState((state) => ({ ...state, subject: e.detail }));
    setTimeout(() => {
      nameRef.current?.focus();
    }, 100);
  }

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

  return hasJavascript ? (
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
      <Submit value="Submit" />
    </form>
  ) : (
    <div className="no-js-hidden">This page requires Javascript.</div>
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

export default ContactForm;
