import type { Prisma } from "@prisma/client";
import { Link, useLocation, useSubmit } from "@remix-run/react";
import type { fetchBlogs } from "~/server/models/blog.server";
import { FiBookmark, FiHeart } from "react-icons/fi";
import { formatDate } from "~/utils/formatDate";
import Tag from "../tag";

export default function BlogCard(props: PropsTypes) {
  const {
    blog: {
      id,
      title,
      author: {
        userName,
        profile: { userImage },
      },
      likes,
      bookmarks,
      tags,
      updatedAt,
    },
    index,
    user: authenticatedUser,
  } = props;

  const { pathname } = useLocation();
  const submit = useSubmit();

  const isBlogLiked =
    likes.filter((user) => user.id === authenticatedUser?.id).length > 0
      ? true
      : false;

  const isBlogBookmarked =
    bookmarks.filter((user) => user.id === authenticatedUser?.id).length > 0
      ? true
      : false;

  function handleBlogLike() {
    const formData = new FormData();
    formData.set("blogId", id);
    formData.set("redirectTo", pathname);

    submit(formData, {
      method: "post",
      action: "/blogs/like",
    });
  }

  function handleBlogBookmark() {
    const formData = new FormData();
    formData.set("blogId", id);
    formData.set("redirectTo", pathname);

    submit(formData, {
      method: "post",
      action: "/blogs/bookmark",
    });
  }

  return (
    <div
      className={`p-4 w-full ${
        index % 2 !== 0 && "col-start-[span_2]"
      } outline outline-black/5 rounded-md shadow-md flex flex-col gap-3`}
    >
      <div className="flex gap-2 items-center">
        <Avatar userImage={userImage} userName={userName} />
        <Link
          to={`/user/${userName}`}
          className="text-sm font-medium hover:underline"
        >
          {userName}
        </Link>
        <span className="text-sm">{formatDate(updatedAt)}</span>
      </div>
      <Link
        to={`/blogs/${id}`}
        className="w-max text-lg font-semibold hover:underline"
      >
        {title}
      </Link>
      <div className="flex gap-2 items-center">
        {tags.map((tag, index) => (
          <Tag key={index} tag={tag.title} />
        ))}
      </div>
      <div className="flex gap-2 items-center text-xl text-gray-200">
        <button type="submit" onClick={handleBlogLike}>
          <FiHeart
            className={`${isBlogLiked && "fill-red-500"} text-red-500`}
          />
        </button>

        <button type="button" onClick={handleBlogBookmark}>
          <FiBookmark
            className={`${
              isBlogBookmarked && "fill-yellow-300"
            } text-yellow-300`}
          />
        </button>
        <span className="text-xs">10 min read</span>
      </div>
    </div>
  );
}

function Avatar(props: { userImage: string | null; userName: string }) {
  const { userImage, userName } = props;

  return (
    <div className="w-5 aspect-square bg-black rounded-full shadow overflow-hidden">
      {userImage ? (
        <img src={userImage} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex justify-center items-center text-white text-sm font-medium uppercase">
          {userName.at(0)}
        </div>
      )}
    </div>
  );
}

interface PropsTypes {
  blog: Prisma.PromiseReturnType<typeof fetchBlogs>[number];
  user?: {
    id: string;
  };
  index: number;
}
