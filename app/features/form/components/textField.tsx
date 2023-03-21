export default function TextField(props: propType) {
  const { label, error, required, ...restProps } = props;

  return (
    <label className="flex-1 flex flex-col gap-1">
      <span
        className={`text-sm text-gray-400 flex ${
          required ? "after:content-['*']" : ""
        }`}
      >
        {label}
      </span>
      <input
        className="p-2 ring ring-transparent focus:ring-blue-300 border rounded-md outline-none"
        required={required}
        {...restProps}
      />
      <p className="text-xs first-letter:uppercase text-red-600">
        {error ? error : <>&nbsp;</>}
      </p>
    </label>
  );
}

interface propType
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> {
  label: string;
  error?: string;
}
