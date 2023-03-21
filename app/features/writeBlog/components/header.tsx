import { useNavigate } from "@remix-run/react";
import { AiOutlineClose } from "react-icons/ai";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="p-2 text-end">
      <button
        onClick={() => navigate("/")}
        className="relative rounded-full p-1 focus:ring ring-blue-300 hover:bg-blue-400 hover:shadow-md hover:text-white outline-none transition-colors"
      >
        <AiOutlineClose size="1.5em" />
      </button>
    </header>
  );
}
