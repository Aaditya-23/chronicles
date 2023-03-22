
export default function Searchbar(props: SearchbarPropTypes) {
  const { setQuery } = props;

  return (
    <input
      type="search"
      placeholder="Search..."
      className="p-2 rounded-full outline outline-black/10"
      onChange={(event) => setQuery(event.target.value)}
    />
  );
}

type SearchbarPropTypes = {
  setQuery(query: string): void;
};
