import { Popover } from "@headlessui/react";
import { MdNotificationsNone } from "react-icons/md";
import type { BlogPublishNotification } from "@prisma/client";
import { Link, useSubmit } from "@remix-run/react";
import { formatDate } from "~/utils/formatDate";

export default function NotificationList(props: NotificationListProps) {
  const { notifications } = props;
  const submit = useSubmit();

  function handleClear() {
    submit(null, {
      method: "post",
      action: "/?index",
    });
  }

  return (
    <Popover className="relative">
      <Popover.Button className="text-xl">
        <MdNotificationsNone />
      </Popover.Button>

      <Popover.Panel className="mt-2 py-2 w-max max-h-[20vmax] absolute right-0 bg-white outline outline-black/5 rounded shadow-md overflow-y-auto">
        <h5 className="mb-4 p-2 pb-0 tracking-wider font-medium">
          Notifications
        </h5>

        {notifications.map((notification, index) => (
          <Notification key={index} notification={notification} />
        ))}

        <div className="mt-4 px-2 flex justify-end">
          <button
            className="text-sm text-blue-400 underline capitalize"
            onClick={handleClear}
          >
            clear
          </button>
        </div>
      </Popover.Panel>
    </Popover>
  );
}

function Notification(props: { notification: BlogPublishNotification }) {
  const { notification } = props;

  return (
    <Link
      to={notification.url}
      className="p-3 flex flex-col gap-1 hover:bg-gray-100"
    >
      <span className="text-sm">{notification.message}.</span>
      <span className="text-xs font-medium text-gray-300">
        {formatDate(notification.createdAt)}
      </span>
    </Link>
  );
}

type NotificationListProps = {
  notifications: BlogPublishNotification[];
};
