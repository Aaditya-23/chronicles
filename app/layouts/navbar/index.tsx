import { MdNotificationsNone } from "react-icons/md";
import { Searchbar } from "~/components";

export default function Navbar() {
  return (
    <nav>
      <ul className="flex p-2 justify-between items-center gap-3">
        <li>
          <h1 className="uppercase font-semibold text-2xl tracking-wider">
            chronicles
          </h1>
        </li>

        <li className="ml-auto">
          <Searchbar />
        </li>

        <li>
          <MdNotificationsNone size="1.3em" />
        </li>

        <li>profile</li>
      </ul>
    </nav>
  );
}
