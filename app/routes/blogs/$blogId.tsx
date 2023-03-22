import type { LoaderArgs, ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useEffect, useRef } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { Navbar } from "~/layouts";
import { fetchBlog } from "~/server/models/blog.server";
import { getUsersProfile } from "~/server/models/user.server";
import { getUserDetails } from "~/utils/session.server";
import { FiBookmark, FiHeart } from "react-icons/fi";
import { Tag } from "~/components";
import Comments from "~/features/comments";
import invariant from "tiny-invariant";
import { postComment, toggleLike } from "~/server/actions/comment.server";
import { Form, Link } from "@remix-run/react";
import { formatDate } from "~/utils/formatDate";

export async function loader({ request, params }: LoaderArgs) {
  const userDetails = await getUserDetails(request);
  const user = await getUsersProfile(userDetails?.userName || "");
  const blogId = params.blogId;
  const blog = await fetchBlog(blogId || "");
  return typedjson({ user, blog });
}

export default function Blog() {
  const { user, blog } = useTypedLoaderData<typeof loader>();
  const ref = useRef<HTMLDivElement>(null);

  const isBlogLiked = blog?.likes
    ? blog.likes.filter((author) => author.id === user?.id).length > 0
      ? true
      : false
    : false;

  const isBlogBookmarked = blog?.bookmarks
    ? blog.bookmarks.filter((_user) => _user.id === user?.id).length > 0
      ? true
      : false
    : false;

  useEffect(() => {
    if (blog === null) return;
    if (ref.current) ref.current.innerHTML = blog.body;
  }, [blog]);

  if (blog === null) return <h2>404 not found</h2>;

  return (
    <>
      <Navbar
        user={
          user
            ? {
                id: user.id,
                firstName: user.firstName,
                userImage: user.profile.userImage,
                userName: user.userName,
              }
            : null
        }
      />

      <div className="mt-8 px-4 flex flex-col gap-5">
        <header className="flex items-center gap-2">
          <div className="w-10 aspect-square rounded-full bg-black overflow-hidden">
            {blog.author.profile.userImage ? (
              <img src={blog.author.profile.userImage} alt="" />
            ) : (
              <div className="h-full w-full flex justify-center items-center text-white uppercase font-medium">
                {blog.author.userName.at(0)}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-px">
            <Link
              to={`/user/${blog.author.userName}`}
              className="text-sm font-medium hover:underline"
            >
              {blog.author.userName}
            </Link>
            <span className="text-xs">{formatDate(blog.createdAt)}</span>
          </div>
        </header>

        <div className="flex flex-col gap-5">
          <h1 className="text-5xl font-bold">{blog.title}</h1>
          <div id="blog-body" ref={ref}></div>
        </div>

        <footer className="space-y-5">
          <div>
            {blog.tags.map((tag, index) => (
              <Tag tag={tag.title} key={index} />
            ))}
          </div>

          <div className="text-lg flex gap-2">
            <Form method="post" action="/blogs/like">
              <input
                type="hidden"
                name="redirectTo"
                value={`/blogs/${blog.id}`}
              />
              <button type="submit" name="blogId" value={blog.id}>
                <FiHeart
                  className={`${isBlogLiked && "fill-red-500"} text-red-500`}
                />
              </button>
            </Form>

            <Form method="post" action="/blogs/bookmark">
              <input
                type="hidden"
                name="redirectTo"
                value={`/blogs/${blog.id}`}
              />
              <button type="submit" name="blogId" value={blog.id}>
                <FiBookmark
                  className={`${
                    isBlogBookmarked && "fill-yellow-300"
                  } text-yellow-300`}
                />
              </button>
            </Form>
          </div>

          <Comments
            userId={user?.id}
            blogId={blog.id}
            comments={blog.comments}
          />
        </footer>
      </div>
    </>
  );
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);
  const _action = payload._action;
  const user = await getUserDetails(request);

  invariant(_action !== null && typeof _action === "string");

  if (_action === "comment") {
    return await postComment(payload, user);
  } else if (_action === "like-comment") {
    return await toggleLike(payload, user);
  }

  return json({ message: "no _action found" }, { status: 400 });
}
