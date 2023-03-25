import { Menu } from "@headlessui/react";
import { motion } from "framer-motion";
import { Link, useSubmit } from "@remix-run/react";
import { CgProfile, CgBookmark } from "react-icons/cg";
import { HiPencil, HiOutlineLogout } from "react-icons/hi";
import { Fragment } from "react";
import { FiSearch } from "react-icons/fi";
import NotificationList from "~/features/notificationList";
import { Prisma } from "@prisma/client";

export default function Navbar(props: NavbarProps) {
  const { user } = props;

  return (
    <nav>
      <ul className="flex p-2 justify-between items-center gap-3">
        <li>
          <h1 className="font-pacifico text-2xl uppercase">
            <Link to="/" className="">
              chronicles
            </Link>
          </h1>
        </li>

        <li className="ml-auto">
          <Link to="/search">
            <FiSearch />
          </Link>
        </li>

        {user && (
          <li>
            <NotificationList notifications={user.notificationList} />
          </li>
        )}

        <li>
          {user ? (
            <User userImage={user.profile.userImage} userName={user.userName} />
          ) : (
            <Link
              to="/signin"
              className="uppercase underline text-blue-400 font-medium"
            >
              sign in
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}

function User(props: { userImage: string | null; userName: string }) {
  const { userImage, userName } = props;
  const submit = useSubmit();

  function handleLogout() {
    submit(null, {
      method: "post",
      action: "/logout",
    });
  }

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="w-8 aspect-square bg-black rounded-full shadow">
        {userImage ? (
          <img src={userImage} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full text-white uppercase font-medium flex items-center justify-center">
            {userName.at(0)}
          </div>
        )}
      </Menu.Button>

      <Menu.Items
        as={motion.div}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="p-2 text-sm font-medium absolute z-10 mt-1 right-0 w-max bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden origin-top"
      >
        <Menu.Item as={Fragment}>
          {({ active }) => (
            <Link
              to={`/user/${userName}`}
              className={`p-2 flex items-center gap-2 capitalize rounded  ${
                active ? "bg-stone-700 text-white" : ""
              }`}
            >
              <CgProfile size="1.3em" />
              profile
            </Link>
          )}
        </Menu.Item>
        <Menu.Item as={Fragment}>
          {({ active }) => (
            <Link
              to="/user/savedblogs"
              className={`p-2 flex items-center gap-2 capitalize rounded  ${
                active ? "bg-stone-700 text-white" : ""
              }`}
            >
              <CgBookmark size="1.3em" />
              saved blogs
            </Link>
          )}
        </Menu.Item>
        <Menu.Item as={Fragment}>
          {({ active }) => (
            <Link
              to="/blogs/write"
              className={`p-2 flex items-center gap-2 capitalize rounded  ${
                active ? "bg-stone-700 text-white" : ""
              }`}
            >
              <HiPencil size="1.3em" />
              write
            </Link>
          )}
        </Menu.Item>
        <Menu.Item as={Fragment}>
          {({ active }) => (
            <button
              onClick={handleLogout}
              className={`p-2 w-full flex items-center gap-2 capitalize rounded outline-none  ${
                active ? "bg-stone-700 text-white" : ""
              }`}
            >
              <HiOutlineLogout size="1.3em" />
              logout
            </button>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
}

const UserWithNotifications = Prisma.validator<Prisma.UserArgs>()({
  include: {
    notificationList: true,
    profile: {
      select: {
        userImage: true,
      },
    },
  },
});

type UserType = Prisma.UserGetPayload<typeof UserWithNotifications>;

interface NavbarProps {
  user: Pick<
    UserType,
    "id" | "userName" | "firstName" | "profile" | "notificationList"
  > | null;
}
