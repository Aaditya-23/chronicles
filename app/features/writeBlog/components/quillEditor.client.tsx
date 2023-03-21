import ReactQuill from "react-quill";

const toolbar = [
  ["bold", "italic", "underline", "strike"],
  ["blockquote", "code-block"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }],
  [{ size: [false, "large"] }],
  ["link", "image"],
  [{ font: ["sans"] }],
];

export default function QuillEditor(props: PropTypes) {
  const { value, setValue } = props;
  
  return (
    <ReactQuill
      value={value}
      onChange={setValue}
      modules={{ toolbar }}
      className="flex flex-col gap-2 [&>:nth-child(1)]:flex [&>:nth-child(1)]:justify-center [&>:nth-child(1)]:flex-wrap [&>:nth-child(1)]:gap-y-3 [&>:nth-child(1)]:!border-none [&>:nth-child(1)]:bg-[hsl(0,0%,98%)]  [&>:nth-child(2)]:!border-none [&>:nth-child(2)]:min-h-[20rem]"
    />
  );
}

interface PropTypes {
  value: string;
  setValue(value: string): void;
}
