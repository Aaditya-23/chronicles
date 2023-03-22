import type { LoaderArgs } from "@remix-run/node";
import { getUsersProfile } from "~/server/models/user.server";
import { getUserDetails } from "~/utils/session.server";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { useNavigate } from "@remix-run/react";
import { BlogCard } from "~/components";
import { Navbar } from "~/layouts";

export async function loader({ request }: LoaderArgs) {
  const loggedInUser = await getUserDetails(request);

  const user = await getUsersProfile(loggedInUser?.userName || "");

  return typedjson(user, { status: 200 });
}

export default function SavedBlogs() {
  const user = useTypedLoaderData<typeof loader>();
  const navigate = useNavigate();

  if (user === null) return navigate("/signin");

  return (
    <>
      <Navbar
        user={{
          id: user.id,
          userImage: user.profile.userImage,
          userName: user.userName,
          firstName: user.firstName,
        }}
      />

      <main className="mt-8 px-3">
        <div className="grid grid-cols-4">
          {user.bookmaredBlogs.map((blog, index) => (
            <BlogCard blog={blog} key={index} index={index} user={user} />
          ))}
        </div>

        {user.bookmaredBlogs.length === 0 && (
          <h1 className="text-2xl font-semibol capitalize">
            you dont have any bookmarked blogs.
          </h1>
        )}
      </main>
    </>
  );
}
