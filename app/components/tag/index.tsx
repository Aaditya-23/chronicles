export default function Tag({ tag }: { tag: string }) {
  return (
    <div className="p-1 rounded-md text-sm hover:bg-stone-600 hover:text-white ">
      #{tag}
    </div>
  );
}
