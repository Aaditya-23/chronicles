import { Link } from "@remix-run/react";

export default function Tag({ tag }: { tag: string }) {
  return (
    <Link to="#" className="p-1 rounded-md text-sm hover:bg-stone-600 hover:text-white ">
      #{tag}
    </Link>
  );
}
