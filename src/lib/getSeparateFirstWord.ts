type Return = {
  first: string;
  rest: string;
};
export default function getSeparateFirstWord(text: string): Return {
  const [first, ...rest] = text.split(" ");
  return {
    first,
    rest: rest.join(" "),
  };
}
