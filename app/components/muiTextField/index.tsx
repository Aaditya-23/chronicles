export default function TextField(props: InputProps) {
  const { label, disabled, ...inputProps } = props;

  return (
    <label className={`block flex-1 ${disabled ? "opacity-60" : ""}`}>
      <span
        className={`block w-max mb-2 text-sm ${
          disabled ? "text-gray-400" : ""
        }`}
      >
        {label}
      </span>
      <input
        className={`border w-full p-2 rounded ring ring-transparent focus:border-transparent focus:ring-blue-300 outline-none`}
        disabled={disabled}
        {...inputProps}
      />
    </label>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}
